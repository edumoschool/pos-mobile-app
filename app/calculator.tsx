import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Pressable, useWindowDimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { Delete, Plus, Minus, X, Divide } from 'lucide-react-native';

type Operator = '+' | '-' | '×' | '÷' | null;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const primary = useColor('primary');
  const cardBg = useColor('card');
  const bgColor = useColor('background');
  const textColor = useColor('foreground');
  const textMuted = useColor('mutedForeground');

  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true })
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [blinkAnim]);

  const PADDING = 20;
  const GAP = 12;
  const COLS = 4;
  const btnWidth = (width - PADDING * 2 - GAP * (COLS - 1)) / COLS;
  const btnHeight = btnWidth * 1.05;

  const formatDisplay = (val: string) => {
    if (!val) return '';
    const parts = val.split('.');
    const intPart = parts[0].replace(/^-/, '');
    const formatted = intPart ? parseInt(intPart, 10).toLocaleString('en-US') : '';
    const sign = val.startsWith('-') ? '-' : '';
    if (parts.length > 1) return `${sign}${formatted}.${parts[1]}`;
    return `${sign}${formatted}`;
  };

  const calculate = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  }, []);

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      if (display === '0' && digit !== '.') {
        setDisplay(digit);
      } else if (digit === '.' && display.includes('.')) {
        return;
      } else {
        if (display.replace(/[^0-9.]/g, '').length >= 15) return;
        setDisplay(display + digit);
      }
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback((nextOp: Operator) => {
    const current = parseFloat(display);

    if (previousValue !== null && !waitingForOperand && operator) {
      const result = calculate(previousValue, current, operator);
      const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
      setDisplay(resultStr);
      setPreviousValue(result);
      setHistory(`${result} ${nextOp}`);
    } else {
      setPreviousValue(current);
      setHistory(`${formatDisplay(display)} ${nextOp}`);
    }

    setOperator(nextOp);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, waitingForOperand, calculate]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || operator === null) return;

    const current = parseFloat(display);
    const result = calculate(previousValue, current, operator);
    const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');

    setHistory(`${formatDisplay(String(previousValue))} ${operator} ${formatDisplay(display)} =`);
    setDisplay(resultStr);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, calculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHistory('');
  }, []);

  const handleBackspace = useCallback(() => {
    if (waitingForOperand) return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  }, [waitingForOperand]);

  const handlePercent = useCallback(() => {
    const current = parseFloat(display);
    if (previousValue !== null && operator) {
      const pct = (previousValue * current) / 100;
      setDisplay(pct.toString());
    } else {
      setDisplay((current / 100).toString());
    }
  }, [display, previousValue, operator]);

  type ButtonConfig = {
    label: string;
    icon?: any;
    type: 'digit' | 'operator' | 'action' | 'equals';
    value: string;
    color?: string;
  };

  const buttonsLayout: ButtonConfig[][] = [
    [
      { label: 'C', type: 'action', value: 'clear', color: primary },
      { label: '÷', icon: Divide, type: 'operator', value: '÷', color: primary },
      { label: '×', icon: X, type: 'operator', value: '×', color: primary },
      { label: '⌫', icon: Delete, type: 'action', value: 'backspace', color: primary },
    ],
    [
      { label: '7', type: 'digit', value: '7', color: textColor },
      { label: '8', type: 'digit', value: '8', color: textColor },
      { label: '9', type: 'digit', value: '9', color: textColor },
      { label: '-', icon: Minus, type: 'operator', value: '-', color: primary },
    ],
    [
      { label: '4', type: 'digit', value: '4', color: textColor },
      { label: '5', type: 'digit', value: '5', color: textColor },
      { label: '6', type: 'digit', value: '6', color: textColor },
      { label: '+', icon: Plus, type: 'operator', value: '+', color: primary },
    ],
  ];

  const bottomLeftButtons: ButtonConfig[][] = [
    [
      { label: '1', type: 'digit', value: '1', color: textColor },
      { label: '2', type: 'digit', value: '2', color: textColor },
      { label: '3', type: 'digit', value: '3', color: textColor },
    ],
    [
      { label: '%', type: 'action', value: 'percent', color: textColor },
      { label: '0', type: 'digit', value: '0', color: textColor },
      { label: '.', type: 'digit', value: '.', color: textColor },
    ]
  ];

  const handleButtonPress = (btn: ButtonConfig) => {
    switch (btn.type) {
      case 'digit':
        handleDigit(btn.value);
        break;
      case 'operator':
        handleOperator(btn.value as Operator);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'action':
        if (btn.value === 'clear') handleClear();
        else if (btn.value === 'backspace') handleBackspace();
        else if (btn.value === 'percent') handlePercent();
        break;
    }
  };

  const isInitial = display === '0' && previousValue === null && !operator && history === '';
  const displayText = isInitial ? '' : formatDisplay(display);
  const displayFontSize = displayText.length > 10 ? 44 : 64;

  const renderButton = (btn: ButtonConfig, w: number, h: number) => {
    const isEquals = btn.type === 'equals';
    const bg = isEquals ? primary : cardBg;
    const contentColor = isEquals ? '#FFFFFF' : btn.color || textColor;

    return (
      <Pressable
        key={btn.value + btn.label}
        onPress={() => handleButtonPress(btn)}
        style={({ pressed }) => ({
          width: w,
          height: h,
          borderRadius: 24,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: .5,
        })}
      >
        {btn.icon ? (
          <Icon name={btn.icon} size={28} color={contentColor} strokeWidth={1.5} />
        ) : (
          <Text
            style={{
              fontSize: 28,
              fontWeight: '400',
              color: contentColor,
            }}
          >
            {btn.label}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: t('common.calculator'),
          headerLargeTitle: false,
          headerTransparent: true,
          headerShadowVisible:false,
        }} 
      />

      {/* Display Area */}
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 32, paddingBottom: 24 }}>
        {history !== '' && (
          <Text
            style={{
              fontSize: 28,
              color: textMuted,
              textAlign: 'right',
              marginBottom: 12,
              fontWeight: '300',
            }}
            numberOfLines={1}
          >
            {history}
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', minHeight: 80 }}>
          <Text
            style={{
              fontSize: displayFontSize,
              fontWeight: '300',
              color: textColor,
              letterSpacing: 0.5,
              textAlign: 'right',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayText}
          </Text>
          
          <Animated.View 
            style={{ 
              width: 3, 
              height: displayFontSize * 0.8, 
              backgroundColor: primary, 
              marginLeft: 6, 
              opacity: blinkAnim,
              borderRadius: 2
            }} 
          />
        </View>
      </View>

      {/* Button Grid */}
      <View style={{ paddingHorizontal: PADDING, paddingBottom: 32 + insets.bottom, gap: GAP }}>
        {buttonsLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', gap: GAP }}>
            {row.map((btn) => renderButton(btn, btnWidth, btnHeight))}
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: GAP }}>
          <View style={{ width: btnWidth * 3 + GAP * 2, gap: GAP }}>
            {bottomLeftButtons.map((row, rowIndex) => (
              <View key={`bl-${rowIndex}`} style={{ flexDirection: 'row', gap: GAP }}>
                {row.map((btn) => renderButton(btn, btnWidth, btnHeight))}
              </View>
            ))}
          </View>
          <View>
            {renderButton({ label: '=', type: 'equals', value: '=' }, btnWidth, btnHeight * 2 + GAP)}
          </View>
        </View>
      </View>
    </View>
  );
}
