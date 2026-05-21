import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { identityExamplesByLanguage } from '@/data/identity-examples';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useSettingsStore } from '@/store/settings-store';

// Unique marker used to split the localized template into the text that comes
// before and after the editable identity word.
const VALUE_TOKEN = '__IDENTITY_VALUE__';

export default function Identity() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const inputRef = useRef<TextInput>(null);
  const value = draft.identity ?? '';
  const canContinue = value.trim().length >= 2;
  const updateIdentity = useCallback(
    (identity: string) => setDraft({ identity }),
    [setDraft],
  );

  const examples = identityExamplesByLanguage[language];
  const [prefix, suffix] = t('onboarding.identity.template', { value: VALUE_TOKEN }).split(
    VALUE_TOKEN,
  );

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

      <PreviewCard
        tone="primary"
        label={t('onboarding.identity.label')}
        onPress={() => inputRef.current?.focus()}
      >
        <View style={styles.sentence}>
          {prefix ? (
            <Text variant="headlineSmall" style={[styles.sentenceText, { color: theme.colors.onPrimaryContainer }]}>
              {prefix.trimEnd()}
            </Text>
          ) : null}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={updateIdentity}
            placeholder={t('onboarding.identity.placeholder')}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            autoCapitalize="none"
            style={[
              styles.sentenceText,
              styles.input,
              { color: theme.colors.onPrimaryContainer, borderBottomColor: theme.colors.primary },
            ]}
          />
          {suffix ? (
            <Text variant="headlineSmall" style={[styles.sentenceText, { color: theme.colors.onPrimaryContainer }]}>
              {suffix.trimStart()}
            </Text>
          ) : null}
        </View>
      </PreviewCard>

      <View style={styles.chips}>
        {examples.map((ex) => (
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
  sentence: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  sentenceText: { fontSize: 24, lineHeight: 32, fontWeight: '800' },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 96,
    paddingVertical: 2,
    borderBottomWidth: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
});
