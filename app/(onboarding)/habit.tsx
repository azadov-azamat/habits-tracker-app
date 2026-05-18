import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useOnboardingStore } from '@/store/onboardingStore';
import { habitSuggestions } from '@/data/habitSuggestions';
import { emojiOptions } from '@/data/identityExamples';

export default function HabitScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);
  const name = draft.name ?? '';
  const emoji = draft.emoji ?? '🌱';
  const canContinue = name.trim().length >= 3;

  function applySuggestion(s: (typeof habitSuggestions)[number]) {
    setDraft({
      name: s.name,
      emoji: s.emoji,
      identity: draft.identity || s.identity,
      why: draft.why || s.whyExample,
      minimalVersion: draft.minimalVersion || s.minimalExample,
    });
  }

  return (
    <ScreenScaffold>
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.habit.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.habit.subtitle')}
        </Text>
      </View>

      <View style={styles.preview}>
        <Text style={styles.emojiBig}>{emoji}</Text>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {name || '...'}
        </Text>
      </View>

      <TextInput
        mode="outlined"
        label={t('onboarding.habit.nameLabel')}
        value={name}
        onChangeText={(v) => setDraft({ name: v })}
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
              onPress={() => setDraft({ emoji: e })}
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

      <View style={{ gap: 8 }}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('onboarding.habit.suggestionsTitle')}
        </Text>
        <View style={styles.suggestions}>
          {habitSuggestions.slice(0, 6).map((s) => (
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
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={!canContinue}
          onPress={() => router.push('/(onboarding)/why')}
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
  suggestions: { gap: 8 },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  suggestionEmoji: { fontSize: 20 },
  footer: { marginTop: 8 },
});
