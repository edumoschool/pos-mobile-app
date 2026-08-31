import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

/**
 * Local app-lock. A 4-digit PIN is kept in the device keychain / keystore
 * (expo-secure-store) — never sent anywhere. When a PIN is set the app shows
 * a lock gate on cold start and whenever it returns from the background after
 * more than LOCK_GRACE_MS.
 *
 * A 4-digit PIN is only 10k combinations, so the keychain alone is not the
 * control that matters — throttling is. Failed attempts are counted in the
 * same secure storage and impose an escalating lockout that survives an app
 * restart, which is what stops someone simply relaunching to keep guessing.
 */

const PIN_KEY = 'pos_app_pin';
const ATTEMPTS_KEY = 'pos_app_pin_attempts';
const LOCKED_UNTIL_KEY = 'pos_app_pin_locked_until';

export const PIN_LENGTH = 4;
const LOCK_GRACE_MS = 10_000;

/** Failures tolerated before the pad starts locking out. */
export const MAX_ATTEMPTS = 5;

/**
 * Lockout after the Nth consecutive failure, counting from MAX_ATTEMPTS.
 * Escalating rather than fixed so a mistyped PIN costs seconds while a
 * brute-force attempt quickly becomes impractical.
 */
const LOCKOUT_LADDER_MS = [30_000, 60_000, 300_000, 900_000, 3_600_000];

const isWeb = Platform.OS === 'web';

async function readItem(key: string): Promise<string | null> {
  try {
    if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writeItem(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Storage being unavailable must not take down the caller; the in-memory
    // state below still enforces the lockout for this session.
  }
}

async function deleteItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignored — see writeItem
  }
}

/**
 * Length-independent equality.
 *
 * `===` on strings can return as soon as it finds a differing byte, which in
 * principle leaks how much of a guess was correct. The window is tiny in JS,
 * but this costs nothing and keeps the comparison honest.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function lockoutFor(failures: number): number {
  if (failures < MAX_ATTEMPTS) return 0;
  const step = Math.min(failures - MAX_ATTEMPTS, LOCKOUT_LADDER_MS.length - 1);
  return LOCKOUT_LADDER_MS[step];
}

interface PinLockContextType {
  /** storage has been read at least once */
  isReady: boolean;
  /** a PIN is configured */
  hasPin: boolean;
  /** the lock gate should be shown */
  isLocked: boolean;
  /** consecutive failed attempts */
  failedAttempts: number;
  /** attempts left before the next lockout; 0 while locked out */
  attemptsRemaining: number;
  /** ms remaining on the current lockout, 0 when not locked out */
  lockoutRemainingMs: number;
  /** entry is barred until the lockout expires */
  isLockedOut: boolean;
  /** create a PIN (enables the lock) */
  setupPin: (pin: string) => Promise<void>;
  /** change the PIN — rejects if `current` is wrong */
  changePin: (current: string, next: string) => Promise<boolean>;
  /** remove the PIN — rejects if `current` is wrong */
  disablePin: (current: string) => Promise<boolean>;
  /** check a PIN without side effects */
  verifyPin: (pin: string) => boolean;
  /** attempt to unlock — counts failures and enforces lockout */
  unlock: (pin: string) => boolean;
  /** force the gate on (e.g. from a "lock now" button) */
  lock: () => void;
}

const PinLockContext = createContext<PinLockContextType | null>(null);

export function PinLockProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const backgroundedAt = useRef<number | null>(null);

  // ── Load persisted state once ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [stored, attempts, until] = await Promise.all([
        readItem(PIN_KEY),
        readItem(ATTEMPTS_KEY),
        readItem(LOCKED_UNTIL_KEY),
      ]);
      setPin(stored);
      setIsLocked(!!stored); // cold start → locked when a PIN exists
      setFailedAttempts(Number(attempts) || 0);
      setLockedUntil(Number(until) || 0);
      setIsReady(true);
    })();
  }, []);

  // ── Tick while locked out so the countdown stays live ────────────────
  const isLockedOut = lockedUntil > now;

  useEffect(() => {
    if (!isLockedOut) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [isLockedOut]);

  // ── Re-lock on resume after the grace period ─────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        if (backgroundedAt.current == null) backgroundedAt.current = Date.now();
      } else if (next === 'active') {
        const since = backgroundedAt.current;
        backgroundedAt.current = null;
        // Re-read the clock on resume: a lockout that expired while the app
        // was away should be released, and one that has not must stay.
        setNow(Date.now());
        if (pin && since != null && Date.now() - since >= LOCK_GRACE_MS) {
          setIsLocked(true);
        }
      }
    });
    return () => sub.remove();
  }, [pin]);

  const resetAttempts = useCallback(() => {
    setFailedAttempts(0);
    setLockedUntil(0);
    void deleteItem(ATTEMPTS_KEY);
    void deleteItem(LOCKED_UNTIL_KEY);
  }, []);

  const setupPin = useCallback(
    async (next: string) => {
      await writeItem(PIN_KEY, next);
      setPin(next);
      setIsLocked(false);
      resetAttempts();
    },
    [resetAttempts]
  );

  const changePin = useCallback(
    async (current: string, next: string) => {
      if (!pin || !safeEqual(current, pin)) return false;
      await writeItem(PIN_KEY, next);
      setPin(next);
      resetAttempts();
      return true;
    },
    [pin, resetAttempts]
  );

  const disablePin = useCallback(
    async (current: string) => {
      if (!pin || !safeEqual(current, pin)) return false;
      await deleteItem(PIN_KEY);
      setPin(null);
      setIsLocked(false);
      resetAttempts();
      return true;
    },
    [pin, resetAttempts]
  );

  const verifyPin = useCallback(
    (attempt: string) => !!pin && safeEqual(attempt, pin),
    [pin]
  );

  const unlock = useCallback(
    (attempt: string) => {
      // Refuse outright while locked out, so the counter cannot be worked
      // around by continuing to submit.
      if (lockedUntil > Date.now()) return false;

      if (pin && safeEqual(attempt, pin)) {
        setIsLocked(false);
        resetAttempts();
        return true;
      }

      const failures = failedAttempts + 1;
      const penalty = lockoutFor(failures);
      const until = penalty > 0 ? Date.now() + penalty : 0;

      setFailedAttempts(failures);
      setNow(Date.now());
      if (until) setLockedUntil(until);

      void writeItem(ATTEMPTS_KEY, String(failures));
      if (until) void writeItem(LOCKED_UNTIL_KEY, String(until));

      return false;
    },
    [pin, failedAttempts, lockedUntil, resetAttempts]
  );

  const lock = useCallback(() => {
    if (pin) setIsLocked(true);
  }, [pin]);

  const value = useMemo<PinLockContextType>(
    () => ({
      isReady,
      hasPin: !!pin,
      isLocked,
      failedAttempts,
      attemptsRemaining: isLockedOut ? 0 : Math.max(0, MAX_ATTEMPTS - failedAttempts),
      lockoutRemainingMs: isLockedOut ? lockedUntil - now : 0,
      isLockedOut,
      setupPin,
      changePin,
      disablePin,
      verifyPin,
      unlock,
      lock,
    }),
    [
      isReady,
      pin,
      isLocked,
      failedAttempts,
      isLockedOut,
      lockedUntil,
      now,
      setupPin,
      changePin,
      disablePin,
      verifyPin,
      unlock,
      lock,
    ]
  );

  return <PinLockContext.Provider value={value}>{children}</PinLockContext.Provider>;
}

export function usePinLock() {
  const ctx = useContext(PinLockContext);
  if (!ctx) throw new Error('usePinLock must be used within a PinLockProvider');
  return ctx;
}
