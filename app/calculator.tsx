import React, { useState, useCallback } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { useTranslation } from 'react-i18next';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Delete, RotateCcw, Plus, Minus, X, Divide, Equal, Percent } from 'lucide-react-native';

type Operator = '+' | '-' | '×' | '÷' | null;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');
  const orange = useColor('orange');
  const cardBg = useColor('card');
  const bgColor = useColor('background');
  const textColor = useColor('foreground');
  const textMuted = useColor('mutedForeground');
  const borderColor = useColor('border');

  const PADDING = 16;
  const GAP = 10;
  const COLS = 4;
  const btnWidth = (width - PADDING * 2 - GAP * (COLS - 1)) / COLS;
  const btnHeight = Math.min(btnWidth * 0.72, (height - 340) / 5.5);

  const formatDisplay = (val: string) => {
    const parts = val.split('.');
    const intPart = parts[0].replace(/^-/, '');
    const formatted = parseInt(intPart, 10).toLocaleString('en-US');
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
      // Calculate percentage of previous value
      const pct = (previousValue * current) / 100;
      setDisplay(pct.toString());
    } else {
      setDisplay((current / 100).toString());
    }
  }, [display, previousValue, operator]);

  const handleToggleSign = useCallback(() => {
    if (display === '0') return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  }, [display]);

  type ButtonConfig = {
    label: string;
    icon?: any;
    type: 'digit' | 'operator' | 'action' | 'equals';
    value: string;
    color?: string;
    bg?: string;
  };

  const buttons: ButtonConfig[][] = [
    [
      { label: 'C', type: 'action', value: 'clear', bg: red + '15', color: red },
      { label: '±', type: 'action', value: 'sign', bg: borderColor + '40', color: textMuted },
      { label: '%', icon: Percent, type: 'action', value: 'percent', bg: borderColor + '40', color: textMuted },
      { label: '÷', icon: Divide, type: 'operator', value: '÷', bg: orange + '15', color: orange },
    ],
    [
      { label: '7', type: 'digit', value: '7', bg: cardBg, color: textColor },
      { label: '8', type: 'digit', value: '8', bg: cardBg, color: textColor },
      { label: '9', type: 'digit', value: '9', bg: cardBg, color: textColor },
      { label: '×', icon: X, type: 'operator', value: '×', bg: orange + '15', color: orange },
    ],
    [
      { label: '4', type: 'digit', value: '4', bg: cardBg, color: textColor },
      { label: '5', type: 'digit', value: '5', bg: cardBg, color: textColor },
      { label: '6', type: 'digit', value: '6', bg: cardBg, color: textColor },
      { label: '-', icon: Minus, type: 'operator', value: '-', bg: orange + '15', color: orange },
    ],
    [
      { label: '1', type: 'digit', value: '1', bg: cardBg, color: textColor },
      { label: '2', type: 'digit', value: '2', bg: cardBg, color: textColor },
      { label: '3', type: 'digit', value: '3', bg: cardBg, color: textColor },
      { label: '+', icon: Plus, type: 'operator', value: '+', bg: orange + '15', color: orange },
    ],
    [
      { label: '.', type: 'digit', value: '.', bg: cardBg, color: textColor },
      { label: '0', type: 'digit', value: '0', bg: cardBg, color: textColor },
      { label: '⌫', icon: Delete, type: 'action', value: 'backspace', bg: borderColor + '30', color: textMuted },
      { label: '=', icon: Equal, type: 'equals', value: '=', bg: primary, color: '#FFFFFF' },
    ],
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
        else if (btn.value === 'sign') handleToggleSign();
        break;
    }
  };

  const displayFontSize = display.length > 12 ? 28 : display.length > 9 ? 34 : 42;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: "Kalkulator",
          headerLargeTitle: false,
          headerTransparent: true,
          headerLargeTitleShadowVisible: false,
        }} 
      />

      {/* Display Area */}
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: PADDING }}>
        {/* History */}
        {history !== '' && (
          <Text
            style={{
              fontSize: 16,
              color: textMuted,
              textAlign: 'right',
              marginBottom: 6,
              fontWeight: '500',
            }}
            numberOfLines={1}
          >
            {history}
          </Text>
        )}

        {/* Main Display */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            paddingVertical: 24,
            paddingHorizontal: 24,
            marginBottom: 16,
            alignItems: 'flex-end',
            justifyContent: 'center',
            minHeight: 100,
            borderWidth: 1,
            borderColor: borderColor + '30',
          }}
        >
          <Text
            style={{
              fontSize: displayFontSize,
              fontWeight: '800',
              color: textColor,
              letterSpacing: 0.5,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatDisplay(display)}
          </Text>

          {/* Active operator indicator */}
          {operator && waitingForOperand && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                backgroundColor: orange + '14',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: orange }}>
                {operator}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Button Grid */}
      <View style={{ paddingHorizontal: PADDING, paddingBottom: 24 + insets.bottom, gap: GAP }}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', gap: GAP }}>
            {row.map((btn) => {
              const isActiveOp = btn.type === 'operator' && operator === btn.value && waitingForOperand;
              return (
                <Pressable
                  key={btn.value + btn.label}
                  onPress={() => handleButtonPress(btn)}
                  style={({ pressed }) => ({
                    width: btnWidth,
                    height: btnHeight,
                    borderRadius: 14,
                    backgroundColor: isActiveOp ? orange : (btn.bg || cardBg),
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                    shadowColor: btn.type === 'equals' ? primary : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: btn.type === 'equals' ? 0.3 : 0,
                    shadowRadius: 6,
                    elevation: btn.type === 'equals' ? 4 : 0,
                    borderWidth: isActiveOp ? 0 : 1,
                    borderColor: borderColor + '15',
                  })}
                >
                  {btn.icon ? (
                    <Icon
                      name={btn.icon}
                      size={btn.type === 'equals' ? 22 : 18}
                      color={isActiveOp ? '#FFFFFF' : btn.color || textColor}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: btn.type === 'digit' ? 22 : 20,
                        fontWeight: '700',
                        color: isActiveOp ? '#FFFFFF' : btn.color || textColor,
                      }}
                    >
                      {btn.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
