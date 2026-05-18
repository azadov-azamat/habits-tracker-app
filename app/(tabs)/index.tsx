import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { FortyDayGrid } from '@/components/FortyDayGrid';
import { CheckInButton } from '@/components/CheckInButton';
import { StreakBadge } from '@/components/StreakBadge';
import { WhyReminderCard } from '@/components/WhyReminderCard';
import { MotivationCard } from '@/components/MotivationCard';
import { MinimumViableCard } from '@/components/MinimumViableCard';
import { RecoveryCard } from '@/components/RecoveryCard';
import { MicroHabitRow } from '@/components/MicroHabitRow';
import { MilestoneModal } from '@/components/MilestoneModal';
import { EmptyState } from '@/components/EmptyState';
import {
  canAddMicroHabit,
  selectMainHabit,
  selectMicroHabits,
  useHabitsStore,
} from '@/store/habitsStore';
import { computeStreakStats, isDoneToday } from '@/services/streakCalculator';
import { getUnseenMilestone } from '@/services/milestoneDetector';
import { partOfDay } from '@/utils/dateHelpers';
import { cancelIds } from '@/services/notifications';

export default function HomeTab() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const mainHabit = useHabitsStore(selectMainHabit);
  const microHabits = useHabitsStore(selectMicroHabits);
  const canAddMicro = useHabitsStore(canAddMicroHabit);
  const checkIn = useHabitsStore((s) => s.checkIn);
  const undoCheckIn = useHabitsStore((s) => s.undoCheckIn);
  const markMilestone = useHabitsStore((s) => s.markMilestoneCelebrated);

  const stats = useMemo(
    () => (mainHabit ? computeStreakStats(mainHabit) : null),
    [mainHabit],
  );
  const done = !!mainHabit && isDoneToday(mainHabit);

  const [milestoneDay, setMilestoneDay] = useState<number | null>(null);

  useEffect(() => {
    if (!mainHabit) return;
    const m = getUnseenMilestone(mainHabit);
    if (m) setMilestoneDay(m);
  }, [mainHabit]);

  if (!mainHabit || !stats) {
    return (
      <ScreenScaffold>
        <EmptyState
          title="Asosiy odat topilmadi"
          body="Yangi 40 kunlik chillani boshlash uchun ro‘yxatdan o‘ting."
          actionLabel="Boshlash"
          onAction={() => router.replace('/(onboarding)/welcome')}
        />
      </ScreenScaffold>
    );
  }

  const greetingKey =
    partOfDay() === 'morning'
      ? 'home.greetingMorning'
      : partOfDay() === 'evening'
        ? 'home.greetingEvening'
        : 'home.greetingDay';

  async function handleCheckIn() {
    if (!mainHabit) return;
    checkIn(mainHabit.id);
    await cancelIds(mainHabit.scheduledNotificationIds.slice(1));
  }

  function handleUndo() {
    if (!mainHabit) return;
    undoCheckIn(mainHabit.id);
  }

  return (
    <ScreenScaffold>
      <View style={styles.header}>
        <View>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {t(greetingKey)}
          </Text>
          <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
            {t('home.dayCounter', { day: stats.currentDay })}
          </Text>
        </View>
        <StreakBadge streak={stats.currentStreak} />
      </View>

      <View style={[styles.habitCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
        <View style={styles.habitHead}>
          <Text style={styles.habitEmoji}>{mainHabit.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {mainHabit.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.todayQuestion')}
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            onPress={() => router.push(`/habit/${mainHabit.id}`)}
          />
        </View>

        <View style={styles.gridWrap}>
          <FortyDayGrid habit={mainHabit} />
        </View>

        <CheckInButton
          done={done}
          onCheckIn={handleCheckIn}
          onUndo={handleUndo}
          doneLabel={t('home.alreadyDone')}
          pendingLabel={t('home.checkIn')}
          undoLabel={t('home.undo')}
        />
      </View>

      {!done && stats.missedTwoInARow ? (
        <RecoveryCard twoInARow />
      ) : !done && stats.missedYesterday ? (
        <RecoveryCard twoInARow={false} />
      ) : null}

      {!done ? (
        <MinimumViableCard
          minimalVersion={mainHabit.minimalVersion}
          onAccept={handleCheckIn}
        />
      ) : null}

      <WhyReminderCard why={mainHabit.why} identity={mainHabit.identity} />

      <MotivationCard />

      <View style={styles.microHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
          {t('home.microHabitsTitle')}
        </Text>
        {canAddMicro ? (
          <Button
            mode="text"
            icon="plus"
            compact
            onPress={() => router.push('/habit/new')}
          >
            {t('home.addMicroHabit')}
          </Button>
        ) : null}
      </View>

      <View style={{ gap: 8 }}>
        {microHabits.length === 0 ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, paddingHorizontal: 4 }}>
            Mikro odatlar ixtiyoriy — agar tayyor bo‘lsangiz, qo‘shing.
          </Text>
        ) : (
          microHabits.map((mh) => (
            <MicroHabitRow
              key={mh.id}
              habit={mh}
              onToggle={(id) =>
                isDoneToday(mh) ? undoCheckIn(id) : checkIn(id)
              }
              onOpen={(id) => router.push(`/habit/${id}`)}
            />
          ))
        )}
      </View>

      <MilestoneModal
        visible={milestoneDay !== null}
        day={milestoneDay as 1 | 7 | 14 | 21 | 30 | 40 | null}
        onDismiss={() => {
          if (milestoneDay && mainHabit) {
            markMilestone(mainHabit.id, milestoneDay);
          }
          setMilestoneDay(null);
        }}
        onAddNewHabit={() => {
          if (mainHabit) {
            useHabitsStore.getState().setStatus(mainHabit.id, 'completed');
            useHabitsStore.getState().markMilestoneCelebrated(mainHabit.id, 40);
          }
          setMilestoneDay(null);
          router.replace('/(onboarding)/welcome');
        }}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  habitCard: { padding: 16, borderRadius: 24, borderWidth: 1, gap: 16 },
  habitHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitEmoji: { fontSize: 36 },
  gridWrap: { alignItems: 'center', paddingVertical: 8 },
  microHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});
