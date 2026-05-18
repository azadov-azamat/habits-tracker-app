import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FortyDayGrid } from '@/components/FortyDayGrid';
import { WhyReminderCard } from '@/components/WhyReminderCard';
import { StreakBadge } from '@/components/StreakBadge';
import { ProgressMeter } from '@/components/ProgressMeter';
import { useHabitsStore } from '@/store/habitsStore';
import { computeStreakStats } from '@/services/streakCalculator';
import { cancelHabitNotifications, rescheduleHabit } from '@/services/notifications';
import { formatDateUz } from '@/utils/dateHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitDetail() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === params.id));
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const deleteHabit = useHabitsStore((s) => s.deleteHabit);
  const attachIds = useHabitsStore((s) => s.attachNotificationIds);
  const setStatus = useHabitsStore((s) => s.setStatus);

  const stats = useMemo(() => (habit ? computeStreakStats(habit) : null), [habit]);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(habit?.name ?? '');
  const [draftWhy, setDraftWhy] = useState(habit?.why ?? '');

  if (!habit || !stats) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="" />
        </Appbar.Header>
        <View style={styles.empty}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Odat topilmadi.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  function saveEdits() {
    if (!habit) return;
    updateHabit(habit.id, { name: draftName.trim(), why: draftWhy.trim() });
    setEditing(false);
  }

  function confirmDelete() {
    if (!habit) return;
    Alert.alert(
      t('habit.delete'),
      t('habit.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await cancelHabitNotifications(habit);
            deleteHabit(habit.id);
            router.back();
          },
        },
      ],
      { cancelable: true },
    );
  }

  async function togglePause() {
    if (!habit) return;
    if (habit.status === 'paused') {
      setStatus(habit.id, 'active');
      const ids = await rescheduleHabit({ ...habit, status: 'active' });
      attachIds(habit.id, ids);
    } else {
      setStatus(habit.id, 'paused');
      await cancelHabitNotifications(habit);
      attachIds(habit.id, []);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('habit.details')} />
        <Appbar.Action
          icon={editing ? 'check' : 'pencil'}
          onPress={() => (editing ? saveEdits() : setEditing(true))}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroRow}>
          <Text style={styles.heroEmoji}>{habit.emoji}</Text>
          <View style={{ flex: 1 }}>
            {editing ? (
              <TextInput
                mode="flat"
                dense
                value={draftName}
                onChangeText={setDraftName}
                style={{ backgroundColor: 'transparent' }}
              />
            ) : (
              <Text variant="titleLarge" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
                {habit.name}
              </Text>
            )}
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('habit.since')}: {formatDateUz(habit.startDate)}
            </Text>
          </View>
          <StreakBadge streak={stats.currentStreak} />
        </View>

        <ProgressMeter current={stats.currentDay} total={40} label={t('progress.title')} />

        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <FortyDayGrid habit={habit} />
          </Card.Content>
        </Card>

        {editing ? (
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            label={t('onboarding.why.title')}
            value={draftWhy}
            onChangeText={setDraftWhy}
          />
        ) : (
          <WhyReminderCard why={habit.why} identity={habit.identity} />
        )}

        <Card mode="outlined" style={styles.card}>
          <Card.Content style={{ gap: 6 }}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary, letterSpacing: 1 }}>
              NIYAT
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
              Qachon <Text style={{ fontWeight: '700' }}>{habit.intentionWhen}</Text>, shunda men{' '}
              <Text style={{ fontWeight: '700' }}>{habit.intentionThen}</Text>.
            </Text>
            <Divider style={{ marginVertical: 8 }} />
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Minimal versiya
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontStyle: 'italic' }}>
              “{habit.minimalVersion}”
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={togglePause} icon={habit.status === 'paused' ? 'play' : 'pause'}>
            {habit.status === 'paused' ? t('habit.resume') : t('habit.pause')}
          </Button>
          <Button mode="text" textColor={theme.colors.error} onPress={confirmDelete} icon="delete-outline">
            {t('habit.delete')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroEmoji: { fontSize: 40 },
  card: { borderRadius: 20 },
  actions: { gap: 8, marginTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
