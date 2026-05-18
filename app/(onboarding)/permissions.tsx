import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useHabitsStore } from '@/store/habits-store';
import {
  requestPermissions,
  safeEnsureNotificationSetup,
  safeRescheduleHabit,
} from '@/services/notifications';
import { reportRecoverableError } from '@/utils/recoverable-error';

export default function Permissions() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const markCompleted = useOnboardingStore((s) => s.markCompleted);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const attachIds = useHabitsStore((s) => s.attachNotificationIds);
  const [denied, setDenied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function finalize(withNotifications: boolean) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const habit = addHabit({
        tier: 'main',
        name: draft.name ?? '',
        emoji: draft.emoji ?? '🌱',
        identity: draft.identity ?? '',
        why: draft.why ?? '',
        intentionWhen: draft.intentionWhen ?? '',
        intentionThen: draft.intentionThen ?? draft.name ?? '',
        minimalVersion: draft.minimalVersion ?? '',
        reminderTime: draft.reminderTime ?? '08:00',
        snoozeIntervalMin: draft.snoozeIntervalMin ?? 15,
        maxSnoozes: draft.maxSnoozes ?? 3,
      });

      if (withNotifications) {
        await safeEnsureNotificationSetup();
        const scheduled = await safeRescheduleHabit(habit);
        if (scheduled.ok) {
          attachIds(habit.id, scheduled.value);
        }
      }

      markCompleted();
      router.replace('/(tabs)');
    } catch (error) {
      reportRecoverableError({
        kind: 'habit-action',
        messageKey: 'errors.habitAction',
        retryLabelKey: 'common.tryAgain',
        source: 'permissions.finalize',
        error,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function allow() {
    const granted = await requestPermissions();
    if (granted) {
      await finalize(true);
    } else {
      setDenied(true);
    }
  }

  return (
    <ScreenScaffold scroll={false}>
      <View style={styles.wrap}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🔔</Text>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            {t('onboarding.permissions.title')}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22 }}
          >
            {t('onboarding.permissions.subtitle')}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 }}
          >
            {t('onboarding.permissions.body')}
          </Text>
          {denied ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
              {t('onboarding.permissions.denied')}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            loading={submitting}
            onPress={allow}
            contentStyle={{ paddingVertical: 6 }}
            style={{ borderRadius: 999 }}
          >
            {t('onboarding.permissions.allow')}
          </Button>
          <Button
            mode="text"
            disabled={submitting}
            onPress={() => finalize(false)}
          >
            {t('onboarding.permissions.later')}
          </Button>
        </View>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: 12, marginTop: 40 },
  emoji: { fontSize: 64 },
  title: { textAlign: 'center', fontWeight: '800' },
  actions: { gap: 8, marginBottom: 12 },
});
