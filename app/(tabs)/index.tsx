import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { FortyDayGrid } from '@/components/forty-day-grid';
import { CheckInButton } from '@/components/check-in-button';
import { StreakBadge } from '@/components/streak-badge';
import { WhyReminderCard } from '@/components/why-reminder-card';
import { MotivationCard } from '@/components/motivation-card';
import { MinimumViableCard } from '@/components/minimum-viable-card';
import { RecoveryCard } from '@/components/recovery-card';
import { MicroHabitRow } from '@/components/micro-habit-row';
import { MilestoneModal } from '@/components/milestone-modal';
import { EmptyState } from '@/components/empty-state';
import { AppButton } from '@/components/app-button';
import {
  canAddMicroHabit,
  selectMainHabit,
  selectMicroHabits,
  useHabitsStore,
} from '@/store/habits-store';
import { computeStreakStats, isDoneToday } from '@/services/streak-calculator';
import { getUnseenMilestone } from '@/services/milestone-detector';
import { partOfDay } from '@/utils/date-helpers';
import { cancelIds } from '@/services/notifications';

function greetingKeyFor(period: ReturnType<typeof partOfDay>): string {
  switch (period) {
    case 'morning':
      return 'home.greetingMorning';
    case 'evening':
      return 'home.greetingEvening';
    case 'night':
      return 'home.greetingNight';
    default:
      return 'home.greetingDay';
  }
}

export default function HomeTab() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const mainHabit = useHabitsStore(selectMainHabit);
  const microHabits = useHabitsStore(useShallow(selectMicroHabits));
  const canAddMicro = useHabitsStore(canAddMicroHabit);
  const checkIn = useHabitsStore((s) => s.checkIn);
  const undoCheckIn = useHabitsStore((s) => s.undoCheckIn);
  const markMilestone = useHabitsStore((s) => s.markMilestoneCelebrated);

  const stats = useMemo(
    () => (mainHabit ? computeStreakStats(mainHabit) : null),
    [mainHabit],
  );
  const done = !!mainHabit && isDoneToday(mainHabit);

  const [greetingKey, setGreetingKey] = useState(() => greetingKeyFor(partOfDay()));
  const [isEvening, setIsEvening] = useState(() => new Date().getHours() >= 18);
  const [recoveryDismissed, setRecoveryDismissed] = useState(false);
  const [microExpanded, setMicroExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setGreetingKey(greetingKeyFor(partOfDay()));
      setIsEvening(new Date().getHours() >= 18);
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setGreetingKey(greetingKeyFor(partOfDay()));
        setIsEvening(new Date().getHours() >= 18);
      }
    });
    return () => sub.remove();
  }, []);

  const [milestoneDay, setMilestoneDay] = useState<number | null>(null);
  const [fireBurst, setFireBurst] = useState(0);

  useEffect(() => {
    if (!mainHabit) return;
    const m = getUnseenMilestone(mainHabit);
    if (m) setMilestoneDay(m);
  }, [mainHabit]);

  const handleCheckIn = useCallback(async () => {
    if (!mainHabit) return;
    checkIn(mainHabit.id);
    setFireBurst((value) => value + 1);
    await cancelIds(mainHabit.scheduledNotificationIds.slice(1));
  }, [checkIn, mainHabit]);

  const handleUndo = useCallback(() => {
    if (!mainHabit) return;
    undoCheckIn(mainHabit.id);
  }, [mainHabit, undoCheckIn]);

  const handleMicroToggle = useCallback(
    (id: string) => {
      const habit = useHabitsStore.getState().habits.find((h) => h.id === id);
      if (!habit) return;
      if (isDoneToday(habit)) {
        undoCheckIn(id);
      } else {
        checkIn(id);
      }
    },
    [checkIn, undoCheckIn],
  );

  const handleMicroOpen = useCallback(
    (id: string) => {
      router.push(`/habit/${id}`);
    },
    [router],
  );

  if (!mainHabit || !stats) {
    return (
      <ScreenScaffold>
        <EmptyState
          title={t('home.emptyTitle')}
          body={t('home.emptyBody')}
          actionLabel={t('onboarding.welcome.start')}
          onAction={() => router.replace('/(onboarding)/welcome')}
        />
      </ScreenScaffold>
    );
  }

  const showRecovery =
    !done && !recoveryDismissed && (stats.missedTwoInARow || stats.missedYesterday);
  const showMinimal = !done && (isEvening || stats.missedTwoInARow);
  const doneMicroCount = microHabits.filter((m) => isDoneToday(m)).length;

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
        {stats.currentStreak > 0 ? (
          <StreakBadge streak={stats.currentStreak} animateKey={fireBurst} />
        ) : null}
      </View>

      <View
        style={[
          styles.habitCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
        ]}
      >
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
            accessibilityLabel={t('habit.details')}
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

      {showRecovery ? (
        <RecoveryCard
          twoInARow={stats.missedTwoInARow}
          onDismiss={() => setRecoveryDismissed(true)}
        />
      ) : null}

      {showMinimal ? (
        <MinimumViableCard
          minimalVersion={mainHabit.minimalVersion}
          onAccept={handleCheckIn}
        />
      ) : null}

      <WhyReminderCard why={mainHabit.why} identity={mainHabit.identity} />

      <View style={styles.microSection}>
        <Pressable
          onPress={() => setMicroExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={t('home.microHabitsTitle')}
          style={styles.microHeader}
        >
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onBackground, fontWeight: '700' }}
          >
            {microExpanded ? '⌄' : '›'}  {t('home.microHabitsTitle')}
            {microHabits.length > 0 ? (
              <Text style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                {'  '}({doneMicroCount}/{microHabits.length})
              </Text>
            ) : null}
          </Text>
          {microExpanded && canAddMicro ? (
            <AppButton
              variant="ghost"
              size="small"
              icon="plus"
              compact
              onPress={() => router.push('/habit/new')}
            >
              {t('home.addMicroHabit')}
            </AppButton>
          ) : null}
        </Pressable>

        {microExpanded ? (
          <View style={{ gap: 8, marginTop: 8 }}>
            {microHabits.length === 0 ? (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, paddingHorizontal: 4 }}
              >
                {t('home.microEmpty')}
              </Text>
            ) : (
              microHabits.map((mh) => (
                <MicroHabitRow
                  key={mh.id}
                  habit={mh}
                  onToggle={handleMicroToggle}
                  onOpen={handleMicroOpen}
                />
              ))
            )}
          </View>
        ) : null}
      </View>

      <MotivationCard />

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
  microSection: { gap: 0 },
  microHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});
