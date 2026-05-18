import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { FortyDayGrid } from '@/components/forty-day-grid';
import { ProgressMeter } from '@/components/progress-meter';
import { selectMainHabit, useHabitsStore } from '@/store/habits-store';
import { computeStreakStats } from '@/services/streak-calculator';
import { EmptyState } from '@/components/empty-state';

export default function ProgressTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const habit = useHabitsStore(selectMainHabit);
  const stats = useMemo(() => (habit ? computeStreakStats(habit) : null), [habit]);

  if (!habit || !stats) {
    return (
      <ScreenScaffold>
        <EmptyState title={t('progress.title')} body={t('progress.emptyBody')} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold>
      <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
        {t('progress.title')}
      </Text>

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={{ gap: 12, paddingVertical: 14 }}>
          <View style={styles.row}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {habit.name}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {stats.currentDay}-kun / 40
              </Text>
            </View>
          </View>
          <ProgressMeter current={stats.currentDay} total={40} />
        </Card.Content>
      </Card>

      <View style={styles.statsRow}>
        <StatTile
          value={`${stats.currentStreak}`}
          label={t('progress.currentStreak')}
          icon="🔥"
        />
        <StatTile
          value={`${stats.longestStreak}`}
          label={t('progress.longestStreak')}
          icon="🏆"
        />
        <StatTile
          value={`${stats.totalDone}`}
          label={t('progress.totalDone')}
          icon="✅"
        />
        <StatTile
          value={`${stats.completionRate}%`}
          label={t('progress.completionRate')}
          icon="📊"
        />
      </View>

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={{ gap: 12, paddingVertical: 14 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('progress.mapTitle')}
          </Text>
          <FortyDayGrid habit={habit} />
        </Card.Content>
      </Card>
    </ScreenScaffold>
  );
}

const StatTile = React.memo(function StatTile({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        tileStyles.tile,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
      ]}
    >
      <Text style={tileStyles.icon}>{icon}</Text>
      <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
        {value}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 28 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

const tileStyles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  icon: { fontSize: 22 },
});
