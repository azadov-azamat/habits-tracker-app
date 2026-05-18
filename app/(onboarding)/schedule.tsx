import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useOnboardingStore } from '@/store/onboardingStore';
import { IntervalChips, TimePicker } from '@/components/TimeIntervalPicker';

export default function Schedule() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const time = draft.reminderTime ?? '08:00';
  const interval = draft.snoozeIntervalMin ?? 15;
  const maxSnoozes = draft.maxSnoozes ?? 3;

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

      <View style={styles.section}>
        <TimePicker
          label={t('onboarding.schedule.timeLabel')}
          value={time}
          onChange={(v) => setDraft({ reminderTime: v })}
        />
      </View>

      <View style={styles.section}>
        <IntervalChips
          label={t('onboarding.schedule.intervalLabel')}
          value={interval}
          options={[5, 10, 15, 30, 60]}
          unit={t('common.minutes')}
          onChange={(v) => setDraft({ snoozeIntervalMin: v })}
        />
      </View>

      <View style={styles.section}>
        <IntervalChips
          label={t('onboarding.schedule.maxSnoozesLabel')}
          value={maxSnoozes}
          options={[1, 2, 3, 4, 5]}
          onChange={(v) => setDraft({ maxSnoozes: v })}
        />
      </View>

      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20, marginTop: 4 }}
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
  section: { paddingVertical: 8 },
  footer: { marginTop: 16 },
});
