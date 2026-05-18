import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canAddMicroHabit, useHabitsStore } from '@/store/habits-store';
import { emojiOptions } from '@/data/identity-examples';
import { AppErrorBanner } from '@/components/app-error-banner';
import { IntervalChips, TimePicker } from '@/components/time-interval-picker';
import { safeEnsureNotificationSetup, safeRescheduleHabit } from '@/services/notifications';
import { reportRecoverableError } from '@/utils/recoverable-error';

const SNOOZE_INTERVAL_OPTIONS = [5, 10, 15, 30, 60];
const MAX_SNOOZE_OPTIONS = [1, 2, 3, 4, 5];

export default function NewHabit() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const addHabit = useHabitsStore((s) => s.addHabit);
  const attachIds = useHabitsStore((s) => s.attachNotificationIds);
  const allowed = useHabitsStore(canAddMicroHabit);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🌱');
  const [time, setTime] = useState('09:00');
  const [interval, setInterval] = useState(15);
  const [maxSnoozes, setMax] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const updateEmoji = useCallback((value: string) => setEmoji(value), []);

  async function save() {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const habit = addHabit({
        tier: 'micro',
        name: name.trim(),
        emoji,
        identity: '',
        why: '',
        intentionWhen: '',
        intentionThen: name.trim(),
        minimalVersion: name.trim(),
        reminderTime: time,
        snoozeIntervalMin: interval,
        maxSnoozes,
      });
      await safeEnsureNotificationSetup();
      const scheduled = await safeRescheduleHabit(habit);
      if (scheduled.ok) {
        attachIds(habit.id, scheduled.value);
      }
      router.back();
    } catch (error) {
      reportRecoverableError({
        kind: 'habit-action',
        messageKey: 'errors.habitAction',
        retryLabelKey: 'common.tryAgain',
        source: 'newHabit.save',
        error,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('habit.newMicroHabit')} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!allowed ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
            {t('habit.microLimitReached')}
          </Text>
        ) : null}

        <View style={[styles.preview, { backgroundColor: 'rgba(124, 77, 255, 0.08)' }]}>
          <Text style={styles.bigEmoji}>{emoji}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {name || '...'}
          </Text>
        </View>

        <TextInput
          mode="outlined"
          label={t('onboarding.habit.nameLabel')}
          value={name}
          onChangeText={setName}
          placeholder={t('onboarding.habit.namePlaceholder')}
        />

        <View>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            {t('onboarding.habit.emojiLabel')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
            {emojiOptions.map((e) => (
              <Pressable
                key={e}
                onPress={() => updateEmoji(e)}
                style={[
                  styles.emojiChip,
                  {
                    backgroundColor:
                      emoji === e ? theme.colors.primaryContainer : theme.colors.surface,
                    borderColor:
                      emoji === e ? theme.colors.primary : theme.colors.outline,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <TimePicker
          label={t('onboarding.schedule.timeLabel')}
          value={time}
          onChange={setTime}
        />

        <IntervalChips
          label={t('onboarding.schedule.intervalLabel')}
          value={interval}
          options={SNOOZE_INTERVAL_OPTIONS}
          unit={t('common.minutes')}
          onChange={setInterval}
        />

        <IntervalChips
          label={t('onboarding.schedule.maxSnoozesLabel')}
          value={maxSnoozes}
          options={MAX_SNOOZE_OPTIONS}
          onChange={setMax}
        />

        <Button
          mode="contained"
          onPress={save}
          loading={submitting}
          disabled={!allowed || !name.trim()}
          style={{ borderRadius: 999, marginTop: 8 }}
          contentStyle={{ paddingVertical: 6 }}
        >
          {t('common.save')}
        </Button>
      </ScrollView>
      <AppErrorBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  preview: { alignItems: 'center', padding: 20, borderRadius: 20, gap: 6 },
  bigEmoji: { fontSize: 48 },
  emojiRow: { gap: 8 },
  emojiChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 22 },
});
