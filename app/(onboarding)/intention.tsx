import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
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
  const canContinue = when.trim().length > 0 && then.trim().length > 0 && minimal.trim().length > 0;

  return (
    <ScreenScaffold>
      <View style={styles.head}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('onboarding.intention.title')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
          {t('onboarding.intention.subtitle')}
        </Text>
      </View>

      <View style={[styles.preview, { backgroundColor: 'rgba(124, 77, 255, 0.08)' }]}>
        <Text variant="labelMedium" style={{ color: theme.colors.primary, letterSpacing: 1 }}>
          {t('onboarding.intention.preview').toUpperCase()}
        </Text>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
          Agar <Text style={{ fontWeight: '700' }}>{when || '___'}</Text>, men{' '}
          <Text style={{ fontWeight: '700' }}>{previewAction}</Text>.
        </Text>
      </View>

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

      <View style={styles.divider} />

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

      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={!canContinue}
          onPress={() => router.push('/(onboarding)/schedule')}
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
  preview: { padding: 20, borderRadius: 20, gap: 8 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 4 },
  footer: { marginTop: 8 },
});
