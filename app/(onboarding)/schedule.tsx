import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
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
    <ScreenScaffold
      footer={(
        <OnboardingFooter onNext={() => router.push('/(onboarding)/permissions')} />
      )}
    >
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.schedule.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.schedule.subtitle')}
        </Text>
      </View>

      <PreviewCard tone="primary" centered emoji="⏰">
        <Text
          variant="headlineSmall"
          style={[styles.previewTime, { color: theme.colors.onPrimaryContainer }]}
        >
          {time}
        </Text>
      </PreviewCard>

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

    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6 },
  title: { fontWeight: '800' },
  previewTime: { fontWeight: '800', letterSpacing: 1 },
  section: { gap: 8 },
});
