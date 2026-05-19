import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { useOnboardingStore } from '@/store/onboarding-store';
import { formatActionForPreview } from '@/utils/format-action-for-preview';

export default function Intention() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const when = draft.intentionWhen ?? '';
  const then = draft.intentionThen ?? draft.name ?? '';
  const minimal = draft.minimalVersion ?? '';
  const previewAction = formatActionForPreview(then);
  const placeholder = t('onboarding.intention.templatePlaceholder');
  const canContinue = when.trim().length > 0 && then.trim().length > 0 && minimal.trim().length > 0;

  return (
    <ScreenScaffold
      footer={(
        <OnboardingFooter
          disabled={!canContinue}
          onNext={() => router.push('/(onboarding)/schedule')}
        />
      )}
    >
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.intention.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.intention.subtitle')}
        </Text>
      </View>

      <PreviewCard tone="primary" label={t('onboarding.intention.preview')}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onPrimaryContainer, lineHeight: 24 }}
        >
          {t('onboarding.intention.templateWhen')}{' '}
          <Text style={{ fontWeight: '700' }}>{when || placeholder}</Text>,{' '}
          {t('onboarding.intention.templateThen')}{' '}
          <Text style={{ fontWeight: '700' }}>{previewAction || placeholder}</Text>.
        </Text>
      </PreviewCard>

      <TextInput
        mode="outlined"
        label={t('onboarding.intention.whenLabel')}
        value={when}
        onChangeText={(v) => setDraft({ intentionWhen: v })}
        placeholder={t('onboarding.intention.whenPlaceholder')}
      />
      <TextInput
        mode="outlined"
        label={t('onboarding.intention.thenLabel')}
        value={then}
        onChangeText={(v) => setDraft({ intentionThen: v })}
        placeholder={t('onboarding.intention.thenPlaceholder')}
      />

      <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

      <TextInput
        mode="outlined"
        label={t('onboarding.intention.minimalLabel')}
        value={minimal}
        onChangeText={(v) => setDraft({ minimalVersion: v })}
        placeholder={t('onboarding.intention.minimalPlaceholder')}
      />
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
        {t('onboarding.intention.minimalHint')}
      </Text>

    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6 },
  title: { fontWeight: '800' },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
});
