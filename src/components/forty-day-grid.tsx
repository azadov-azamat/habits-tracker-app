import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, type MD3Theme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { addDaysKey, todayKey } from '@/utils/date-helpers';
import type { Habit } from '@/store/types';
import { CHILLA_DAYS } from '@/store/habits-store';

type Props = {
  habit: Habit;
  compact?: boolean;
  showLegend?: boolean;
};

type CellState = 'done' | 'today' | 'missed' | 'upcoming';

const ROWS = 5;
const COLS = 8;
const ROW_INDEXES = Array.from({ length: ROWS }, (_, index) => index);
const COL_INDEXES = Array.from({ length: COLS }, (_, index) => index);

export const FortyDayGrid = React.memo(function FortyDayGrid({
  habit,
  compact,
  showLegend = false,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
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
        {ROW_INDEXES.map((r) => (
          <View key={r} style={[styles.row, { gap }]}>
            {COL_INDEXES.map((c) => {
              const idx = r * COLS + c;
              const state = cells[idx]!;
              const bg = colorFor(state, theme);
              const border = state === 'today' ? theme.colors.primary : 'transparent';
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
      {showLegend && !compact && (
        <View style={styles.legend}>
          <Legend color={theme.colors.tertiary} label={t('progress.gridLegend.done')} />
          <Legend color={theme.colors.secondaryContainer} label={t('progress.gridLegend.today')} />
          <Legend color={theme.colors.surfaceVariant} label={t('progress.gridLegend.upcoming')} />
        </View>
      )}
    </View>
  );
});

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

function colorFor(state: CellState, theme: MD3Theme): string {
  switch (state) {
    case 'done':
      return theme.colors.tertiary;
    case 'today':
      return theme.colors.secondaryContainer;
    case 'missed':
      return theme.colors.surfaceVariant;
    case 'upcoming':
      return theme.colors.surfaceVariant;
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
