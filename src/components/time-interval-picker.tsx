import React, { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

export function timeToDate(value: string): Date {
  const [h, m] = value.split(':');
  const date = new Date();
  date.setHours(Math.min(23, parseInt(h || '0', 10)), Math.min(59, parseInt(m || '0', 10)), 0, 0);
  return date;
}

export function dateToTime(date: Date): string {
  return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
}

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TimePicker = React.memo(function TimePicker({ label, value, onChange }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS !== 'ios') {
        setOpen(false);
      }
      if (event.type === 'set' && date) {
        onChange(dateToTime(date));
      }
    },
    [onChange],
  );

  return (
    <View style={styles.wrap}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        onPress={() => setOpen((prev) => !prev)}
        style={({ pressed }) => [
          styles.field,
          {
            borderColor: open ? theme.colors.primary : theme.colors.outline,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          {value}
        </Text>
        <Icon source="clock-outline" size={22} color={theme.colors.onSurfaceVariant} />
      </Pressable>
      {open ? (
        <View style={styles.pickerWrap}>
          <DateTimePicker
            value={timeToDate(value)}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={styles.doneButton}
            >
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
                {t('common.done')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

type IntervalProps = {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  unit?: string;
};

export const IntervalChips = React.memo(function IntervalChips({
  label,
  value,
  options,
  onChange,
  unit,
}: IntervalProps) {
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
});

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerWrap: { alignItems: 'center' },
  doneButton: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
