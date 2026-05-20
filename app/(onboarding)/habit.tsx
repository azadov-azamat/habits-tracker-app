import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { OnboardingFooter } from '@/components/onboarding-footer';
import { PreviewCard } from '@/components/preview-card';
import { useOnboardingStore } from '@/store/onboarding-store';
import { habitSuggestionsByLanguage } from '@/data/habit-suggestions';
import { emojiOptions } from '@/data/identity-examples';
import { useSettingsStore } from '@/store/settings-store';

export default function HabitScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const name = draft.name ?? '';
  const emoji = draft.emoji ?? '🌱';
  const canContinue = name.trim().length >= 3;
  const suggestions = habitSuggestionsByLanguage[language];

  const updateName = useCallback((value: string) => setDraft({ name: value }), [setDraft]);
  const updateEmoji = useCallback((value: string) => setDraft({ emoji: value }), [setDraft]);
  const applySuggestion = useCallback(
    (s: (typeof suggestions)[number]) => {
      setDraft({
        name: s.name,
        emoji: s.emoji,
        identity: draft.identity || s.identity,
        why: draft.why || s.whyExample,
        minimalVersion: draft.minimalVersion || s.minimalExample,
      });
    },
    [draft.identity, draft.minimalVersion, draft.why, setDraft],
  );

  return (
    <ScreenScaffold
      scroll={false}
      footer={(
        <OnboardingFooter
          disabled={!canContinue}
          onNext={() => router.push('/(onboarding)/why')}
        />
      )}
    >
      <View style={styles.header}>
        <View style={styles.head}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('onboarding.habit.title')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
            {t('onboarding.habit.subtitle')}
          </Text>
        </View>

        <PreviewCard tone="primary" centered>
          <Text style={styles.emojiBig}>{emoji}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            {name || '...'}
          </Text>
        </PreviewCard>

        <TextInput
          mode="outlined"
          label={t('onboarding.habit.nameLabel')}
          value={name}
          onChangeText={updateName}
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
      </View>

      <View style={styles.listSection}>
        <Text
          variant="labelLarge"
          style={[styles.listTitle, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('onboarding.habit.suggestionsTitle')}
        </Text>
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.suggestions}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {suggestions.map((s) => (
            <Pressable
              key={s.name}
              onPress={() => applySuggestion(s)}
              style={[
                styles.suggestion,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
              <Text variant="bodyMedium" style={{ flex: 1, color: theme.colors.onSurface }}>
                {s.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  head: { gap: 6 },
  title: { fontWeight: '800' },
  emojiBig: { fontSize: 56 },
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
  listSection: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 20,
    minHeight: 0,
  },
  listTitle: { marginBottom: 8 },
  listScroll: { flex: 1 },
  suggestions: { gap: 8, paddingBottom: 16 },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  suggestionEmoji: { fontSize: 20 },
});
