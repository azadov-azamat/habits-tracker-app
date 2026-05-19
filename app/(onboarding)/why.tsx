import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function Why() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const why = draft.why ?? '';
  const canContinue = why.trim().length >= 6;

  return (
    <ScreenScaffold
      footer={(
        <OnboardingFooter
          disabled={!canContinue}
          onNext={() => router.push('/(onboarding)/intention')}
        />
      )}
    >
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.why.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.why.subtitle')}
        </Text>
      </View>

      <PreviewCard tone="secondary" emoji="💛">
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSecondaryContainer, lineHeight: 24 }}
        >
          {why || t('onboarding.why.placeholder')}
        </Text>
      </PreviewCard>

      <TextInput
        mode="outlined"
        multiline
        numberOfLines={5}
        value={why}
        onChangeText={(v) => setDraft({ why: v })}
        placeholder={t('onboarding.why.placeholder')}
        style={styles.input}
      />

    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6 },
  title: { fontWeight: '800' },
  input: { minHeight: 120 },
});
