import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { useOnboardingStore } from '@/store/onboarding-store';
import { IntervalChips, TimePicker } from '@/components/time-interval-picker';

const SNOOZE_INTERVAL_OPTIONS = [5, 10, 15, 30, 60];
const MAX_SNOOZE_OPTIONS = [1, 2, 3, 4, 5];

export default function Schedule() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const time = draft.reminderTime ?? '08:00';
  const interval = draft.snoozeIntervalMin ?? 15;
  const maxSnoozes = draft.maxSnoozes ?? 3;
  const updateTime = useCallback(
    (reminderTime: string) => setDraft({ reminderTime }),
    [setDraft],
  );
  const updateInterval = useCallback(
    (snoozeIntervalMin: number) => setDraft({ snoozeIntervalMin }),
    [setDraft],
  );
  const updateMaxSnoozes = useCallback(
    (maxSnoozesValue: number) => setDraft({ maxSnoozes: maxSnoozesValue }),
    [setDraft],
  );

  return (
    <ScreenScaffold>
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.schedule.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.schedule.subtitle')}
        </Text>
      </View>

      <View style={styles.preview}>
        <Text style={styles.emojiBig}>⏰</Text>
        <Text
          variant="headlineSmall"
          style={[styles.previewTime, { color: theme.colors.primary }]}
        >
          {time}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          {t('onboarding.schedule.subtitle')}
        </Text>
      </View>

      <View style={styles.section}>
        <TimePicker
          label={t('onboarding.schedule.timeLabel')}
          value={time}
          onChange={updateTime}
        />
      </View>

      <View style={styles.section}>
        <IntervalChips
          label={t('onboarding.schedule.intervalLabel')}
          value={interval}
          options={SNOOZE_INTERVAL_OPTIONS}
          unit={t('common.minutes')}
          onChange={updateInterval}
        />
      </View>

      <View style={styles.section}>
        <IntervalChips
          label={t('onboarding.schedule.maxSnoozesLabel')}
          value={maxSnoozes}
          options={MAX_SNOOZE_OPTIONS}
          onChange={updateMaxSnoozes}
        />
      </View>

      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}
      >
        {t('onboarding.schedule.intervalHint')}
      </Text>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => router.push('/(onboarding)/permissions')}
          contentStyle={{ paddingVertical: 6 }}
          style={{ borderRadius: 999 }}
        >
          {t('common.next')}
        </Button>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6 },
  title: { fontWeight: '800' },
  preview: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    gap: 6,
  },
  emojiBig: { fontSize: 56 },
  previewTime: { fontWeight: '800', letterSpacing: 1 },
  section: { gap: 8 },
  footer: { marginTop: 8 },
});
