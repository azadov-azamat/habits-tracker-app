import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { identityExamples } from '@/data/identity-examples';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function Identity() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const value = draft.identity ?? '';
  const canContinue = value.trim().length >= 2;
  const updateIdentity = useCallback(
    (identity: string) => setDraft({ identity }),
    [setDraft],
  );

  const previewValue = value || t('onboarding.identity.templatePlaceholder');

  return (
    <ScreenScaffold
      footer={(
        <OnboardingFooter
          disabled={!canContinue}
          onNext={() => router.push('/(onboarding)/habit')}
        />
      )}
    >
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.identity.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.identity.subtitle')}
        </Text>
      </View>

      <PreviewCard tone="primary" label={t('onboarding.identity.label')}>
        <Text
          variant="headlineSmall"
          style={[styles.preview, { color: theme.colors.onPrimaryContainer, fontWeight: '800' }]}
        >
          {t('onboarding.identity.template', { value: previewValue })}
        </Text>
      </PreviewCard>

      <TextInput
        mode="outlined"
        value={value}
        onChangeText={updateIdentity}
        placeholder={t('onboarding.identity.placeholder')}
        autoCapitalize="none"
      />

      <View style={styles.chips}>
        {identityExamples.map((ex) => (
          <Pressable
            key={ex}
            onPress={() => updateIdentity(ex)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  value === ex ? theme.colors.primary : theme.colors.surface,
                borderColor:
                  value === ex ? theme.colors.primary : theme.colors.outline,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              style={{ color: value === ex ? theme.colors.onPrimary : theme.colors.onSurface }}
            >
              {ex}
            </Text>
          </Pressable>
        ))}
      </View>

    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6 },
  title: { fontWeight: '800' },
  preview: { lineHeight: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
});
