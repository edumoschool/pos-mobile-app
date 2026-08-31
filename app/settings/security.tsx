import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldOff, KeyRound, Lock } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { usePinLock, PIN_LENGTH } from '@/hooks/usePinLock';
import { PinPad } from '@/components/pin-pad';

type Step = 'menu' | 'new' | 'confirm' | 'current-change' | 'current-disable';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const { hasPin, setupPin, disablePin, verifyPin, lock } = usePinLock();
  const { success: showSuccess } = useToast();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const red = useColor('red');
  const green = useColor('green');

  const [step, setStep] = useState<Step>('menu');
  const [value, setValue] = useState('');
  const [first, setFirst] = useState('');
  const [error, setError] = useState('');

  const reset = (next: Step) => {
    setStep(next);
    setValue('');
    setFirst('');
    setError('');
  };

  const onChange = async (v: string) => {
    setError('');
    setValue(v);
    if (v.length !== PIN_LENGTH) return;

    if (step === 'new') {
      setFirst(v);
      setValue('');
      setStep('confirm');
      return;
    }

    if (step === 'confirm') {
      if (v !== first) {
        setError(t('settings.security.noMatch'));
        reset('new');
        return;
      }
      await setupPin(v);
      showSuccess(t('common.success'), t('settings.security.enabled'));
      reset('menu');
      return;
    }

    if (step === 'current-change') {
      if (!verifyPin(v)) {
        setError(t('settings.security.wrongPin'));
        setValue('');
        return;
      }
      reset('new');
      return;
    }

    if (step === 'current-disable') {
      const ok = await disablePin(v);
      if (!ok) {
        setError(t('settings.security.wrongPin'));
        setValue('');
        return;
      }
      showSuccess(t('common.success'), t('settings.security.disabled'));
      reset('menu');
      return;
    }
  };

  const titles: Record<Exclude<Step, 'menu'>, { title: string; subtitle: string }> = {
    new: { title: t('settings.security.newPin'), subtitle: t('settings.security.newPinSubtitle') },
    confirm: { title: t('settings.security.confirmPin'), subtitle: t('settings.security.confirmPinSubtitle') },
    'current-change': { title: t('settings.security.currentPin'), subtitle: t('settings.security.currentPinSubtitle') },
    'current-disable': { title: t('settings.security.currentPin'), subtitle: t('settings.security.currentPinSubtitle') },
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={t('settings.rows.appLock')}
        onBack={step === 'menu' ? undefined : () => reset('menu')}
      />

      {step === 'menu' ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <View style={{ backgroundColor: card, borderRadius: 16, borderWidth: 1, borderColor: border + '60', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: (hasPin ? green : muted) + '18', alignItems: 'center', justifyContent: 'center' }}>
              {hasPin ? <ShieldCheck size={20} color={green} /> : <ShieldOff size={20} color={muted} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>
                {hasPin ? t('settings.security.on') : t('settings.security.off')}
              </Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                {t('settings.security.explainer')}
              </Text>
            </View>
          </View>

          {!hasPin ? (
            <Action icon={KeyRound} label={t('settings.security.enable')} color={primary} onPress={() => reset('new')} card={card} border={border} text={text} />
          ) : (
            <>
              <Action icon={Lock} label={t('settings.security.lockNow')} color={text} onPress={lock} card={card} border={border} text={text} />
              <Action icon={KeyRound} label={t('settings.security.change')} color={text} onPress={() => reset('current-change')} card={card} border={border} text={text} />
              <Action icon={ShieldOff} label={t('settings.security.disable')} color={red} onPress={() => reset('current-disable')} card={card} border={border} text={text} />
            </>
          )}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 32 }}>
          <PinPad
            value={value}
            onChange={onChange}
            title={titles[step].title}
            subtitle={titles[step].subtitle}
            error={error}
          />
        </View>
      )}
    </View>
  );
}

function Action({
  icon: Icon,
  label,
  color,
  onPress,
  card,
  border,
  text,
}: {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  onPress: () => void;
  card: string;
  border: string;
  text: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: card, borderRadius: 14, borderWidth: 1, borderColor: border + '60', padding: 16 }}
    >
      <Icon size={18} color={color} />
      <Text style={{ fontSize: 15, fontWeight: '600', color }}>{label}</Text>
    </TouchableOpacity>
  );
}
