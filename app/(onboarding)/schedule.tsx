import React, { useCallback, useRef } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { useOnboardingStore } from '@/store/onboarding-store';
import { IntervalChips } from '@/components/time-interval-picker';

const SNOOZE_INTERVAL_OPTIONS = [5, 10, 15, 30, 60];
const MAX_SNOOZE_OPTIONS = [1, 2, 3, 4, 5];

export default function Schedule() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const hourInputRef = useRef<TextInput>(null);
  const time = draft.reminderTime ?? '08:00';
  const interval = draft.snoozeIntervalMin ?? 15;
  const maxSnoozes = draft.maxSnoozes ?? 3;
  const [hour, minute] = time.split(':');
  const updateTime = useCallback(
    (reminderTime: string) => setDraft({ reminderTime }),
    [setDraft],
  );
  const updateTimePart = useCallback(
    (part: 'h' | 'm', text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
      const h = part === 'h' ? cleaned : hour;
      const m = part === 'm' ? cleaned : minute;
      const hi = Math.min(23, parseInt(h || '0', 10));
      const mi = Math.min(59, parseInt(m || '0', 10));
      updateTime(`${`${hi}`.padStart(2, '0')}:${`${mi}`.padStart(2, '0')}`);
    },
    [hour, minute, updateTime],
  );
  const updateInterval = useCallback(
    (snoozeIntervalMin: number) => setDraft({ snoozeIntervalMin }),
    [setDraft],
  );
  const updateMaxSnoozes = useCallback(
    (maxSnoozesValue: number) => setDraft({ maxSnoozes: maxSnoozesValue }),
    [setDraft],
  );

  const keyboardType = Platform.OS === 'ios' ? 'number-pad' : 'numeric';

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

      <PreviewCard
        tone="primary"
        centered
        emoji="⏰"
        onPress={() => hourInputRef.current?.focus()}
      >
        <View style={styles.timeRow}>
          <TextInput
            ref={hourInputRef}
            value={hour}
            onChangeText={(text) => updateTimePart('h', text)}
            keyboardType={keyboardType}
            maxLength={2}
            selectTextOnFocus
            style={[
              styles.timeInput,
              { color: theme.colors.onPrimaryContainer, borderBottomColor: theme.colors.primary },
            ]}
          />
          <Text style={[styles.timeColon, { color: theme.colors.onPrimaryContainer }]}>:</Text>
          <TextInput
            value={minute}
            onChangeText={(text) => updateTimePart('m', text)}
            keyboardType={keyboardType}
            maxLength={2}
            selectTextOnFocus
            style={[
              styles.timeInput,
              { color: theme.colors.onPrimaryContainer, borderBottomColor: theme.colors.primary },
            ]}
          />
        </View>
      </PreviewCard>

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
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeInput: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
    paddingVertical: 2,
    borderBottomWidth: 2,
  },
  timeColon: { fontSize: 34, fontWeight: '800' },
  section: { gap: 8 },
});
