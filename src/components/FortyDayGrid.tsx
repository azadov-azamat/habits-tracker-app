import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { palette } from '@/theme/colors';
import { addDaysKey, todayKey } from '@/utils/dateHelpers';
import type { Habit } from '@/store/types';
import { CHILLA_DAYS } from '@/store/habitsStore';

type Props = {
  habit: Habit;
  compact?: boolean;
};

type CellState = 'done' | 'today' | 'missed' | 'upcoming';

const ROWS = 5;
const COLS = 8;

export function FortyDayGrid({ habit, compact }: Props) {
  const theme = useTheme();
  const today = todayKey();

  const cells = useMemo<CellState[]>(() => {
    const arr: CellState[] = [];
    for (let i = 0; i < CHILLA_DAYS; i++) {
      const day = addDaysKey(habit.startDate, i);
      if (habit.checkIns[day]?.done) {
        arr.push('done');
      } else if (day === today) {
        arr.push('today');
      } else if (day < today) {
        arr.push('missed');
      } else {
        arr.push('upcoming');
      }
    }
    return arr;
  }, [habit.startDate, habit.checkIns, today]);

  const size = compact ? 18 : 28;
  const gap = compact ? 6 : 9;

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap }]}>
        {Array.from({ length: ROWS }).map((_, r) => (
          <View key={r} style={[styles.row, { gap }]}>
            {Array.from({ length: COLS }).map((__, c) => {
              const idx = r * COLS + c;
              const state = cells[idx]!;
              const bg = colorFor(state, theme.dark);
              const border = state === 'today' ? palette.secondary : 'transparent';
              return (
                <Animated.View
                  key={idx}
                  entering={FadeIn.delay(idx * 8).duration(180)}
                  style={[
                    styles.cell,
                    {
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      backgroundColor: bg,
                      borderWidth: state === 'today' ? 2 : 0,
                      borderColor: border,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      {!compact && (
        <View style={styles.legend}>
          <Legend color={palette.success} label="Bajarilgan" />
          <Legend color={palette.gridToday} label="Bugun" />
          <Legend color={theme.dark ? palette.gridEmptyDark : palette.gridEmpty} label="Oldinda" />
        </View>
      )}
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

function colorFor(state: CellState, dark: boolean): string {
  switch (state) {
    case 'done':
      return dark ? palette.successDark : palette.success;
    case 'today':
      return dark ? palette.gridTodayDark : palette.gridToday;
    case 'missed':
      return dark ? '#3D3650' : '#D6CCDE';
    case 'upcoming':
      return dark ? palette.gridEmptyDark : palette.gridEmpty;
  }
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  grid: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  cell: {},
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
