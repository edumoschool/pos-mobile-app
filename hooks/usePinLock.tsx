import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Local app-lock. A 4-digit PIN is kept in the device keychain / keystore
 * (expo-secure-store) — never sent anywhere. When a PIN is set the app shows
 * a lock gate on cold start and whenever it returns from the background after
 * more than LOCK_GRACE_MS.
 */

const PIN_KEY = 'pos_app_pin';
export const PIN_LENGTH = 4;
const LOCK_GRACE_MS = 10_000;

const isWeb = Platform.OS === 'web';

async function readPin(): Promise<string | null> {
  try {
    if (isWeb) return globalThis.localStorage?.getItem(PIN_KEY) ?? null;
    return await SecureStore.getItemAsync(PIN_KEY);
  } catch {
    return null;
  }
}

async function writePin(pin: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(PIN_KEY, pin);
    return;
  }
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

async function clearPin(): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.removeItem(PIN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(PIN_KEY);
}

interface PinLockContextType {
  /** storage has been read at least once */
  isReady: boolean;
  /** a PIN is configured */
  hasPin: boolean;
  /** the lock gate should be shown */
  isLocked: boolean;
  /** create a PIN (enables the lock) */
  setupPin: (pin: string) => Promise<void>;
  /** change the PIN — rejects if `current` is wrong */
  changePin: (current: string, next: string) => Promise<boolean>;
  /** remove the PIN — rejects if `current` is wrong */
  disablePin: (current: string) => Promise<boolean>;
  /** check a PIN without side effects */
  verifyPin: (pin: string) => boolean;
  /** attempt to unlock — returns whether it succeeded */
  unlock: (pin: string) => boolean;
  /** force the gate on (e.g. from a "lock now" button) */
  lock: () => void;
}

const PinLockContext = createContext<PinLockContextType | null>(null);

export function PinLockProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const backgroundedAt = useRef<number | null>(null);

  // ── Load persisted PIN once ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const stored = await readPin();
      setPin(stored);
      setIsLocked(!!stored); // cold start → locked when a PIN exists
      setIsReady(true);
    })();
  }, []);

  // ── Re-lock on resume after the grace period ─────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        if (backgroundedAt.current == null) backgroundedAt.current = Date.now();
      } else if (next === 'active') {
        const since = backgroundedAt.current;
        backgroundedAt.current = null;
        if (pin && since != null && Date.now() - since >= LOCK_GRACE_MS) {
          setIsLocked(true);
        }
      }
    });
    return () => sub.remove();
  }, [pin]);

  const setupPin = useCallback(async (next: string) => {
    await writePin(next);
    setPin(next);
    setIsLocked(false);
  }, []);

  const changePin = useCallback(
    async (current: string, next: string) => {
      if (current !== pin) return false;
      await writePin(next);
      setPin(next);
      return true;
    },
    [pin],
  );

  const disablePin = useCallback(
    async (current: string) => {
      if (current !== pin) return false;
      await clearPin();
      setPin(null);
      setIsLocked(false);
      return true;
    },
    [pin],
  );

  const verifyPin = useCallback((attempt: string) => !!pin && attempt === pin, [pin]);

  const unlock = useCallback(
    (attempt: string) => {
      if (pin && attempt === pin) {
        setIsLocked(false);
        return true;
      }
      return false;
    },
    [pin],
  );

  const lock = useCallback(() => {
    if (pin) setIsLocked(true);
  }, [pin]);

  return (
    <PinLockContext.Provider
      value={{
        isReady,
        hasPin: !!pin,
        isLocked,
        setupPin,
        changePin,
        disablePin,
        verifyPin,
        unlock,
        lock,
      }}
    >
      {children}
    </PinLockContext.Provider>
  );
}

export function usePinLock() {
  const ctx = useContext(PinLockContext);
  if (!ctx) throw new Error('usePinLock must be used within a PinLockProvider');
  return ctx;
}
