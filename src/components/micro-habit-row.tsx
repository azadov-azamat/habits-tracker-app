import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { haptic } from '@/utils/haptics';
import type { Habit } from '@/store/types';
import { isDoneToday } from '@/services/streak-calculator';

type Props = {
  habit: Habit;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
};

export const MicroHabitRow = React.memo(function MicroHabitRow({
  habit,
  onToggle,
  onOpen,
}: Props) {
  const theme = useTheme();
  const done = isDoneToday(habit);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: done
            ? theme.colors.surfaceVariant
            : theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Pressable onPress={() => onOpen(habit.id)} style={styles.info}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
        <View style={styles.text}>
          <Text
            variant="titleSmall"
            style={{
              color: theme.colors.onSurface,
              textDecorationLine: done ? 'line-through' : 'none',
              opacity: done ? 0.6 : 1,
            }}
          >
            {habit.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {done ? t('home.alreadyDone') : habit.reminderTime}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          void haptic.light();
          onToggle(habit.id);
        }}
        style={[
          styles.check,
          {
            backgroundColor: done ? theme.colors.tertiary : 'transparent',
            borderColor: done ? theme.colors.tertiary : theme.colors.outline,
          },
        ]}
      >
        {done ? (
          <Text style={[styles.checkMark, { color: '#FFFFFF' }]}>✓</Text>
        ) : null}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  info: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 24 },
  text: { flex: 1 },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontWeight: '800' },
});
