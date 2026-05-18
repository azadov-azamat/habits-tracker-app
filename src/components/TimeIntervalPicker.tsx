import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TimePicker({ label, value, onChange }: Props) {
  const theme = useTheme();
  const [hour, minute] = value.split(':');

  function handle(part: 'h' | 'm', text: string) {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    let h = part === 'h' ? cleaned : hour ?? '00';
    let m = part === 'm' ? cleaned : minute ?? '00';
    const hi = Math.min(23, parseInt(h || '0', 10));
    const mi = Math.min(59, parseInt(m || '0', 10));
    onChange(`${`${hi}`.padStart(2, '0')}:${`${mi}`.padStart(2, '0')}`);
  }

  return (
    <View style={styles.wrap}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <View style={styles.row}>
        <TextInput
          mode="outlined"
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          value={hour}
          onChangeText={(t) => handle('h', t)}
          style={styles.input}
          maxLength={2}
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          :
        </Text>
        <TextInput
          mode="outlined"
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          value={minute}
          onChangeText={(t) => handle('m', t)}
          style={styles.input}
          maxLength={2}
        />
      </View>
    </View>
  );
}

type IntervalProps = {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  unit?: string;
};

export function IntervalChips({ label, value, options, onChange, unit }: IntervalProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <View style={styles.chips}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.outline,
                },
              ]}
            >
              <Text
                variant="labelLarge"
                style={{ color: active ? theme.colors.onPrimary : theme.colors.onSurface }}
              >
                {opt}
                {unit ? ` ${unit}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { width: 80, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
