import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function Welcome() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScreenScaffold scroll={false}>
      <View style={styles.wrap}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🌿</Text>
          <Text
            variant="labelLarge"
            style={{ color: theme.colors.primary, letterSpacing: 1.4 }}
          >
            {t('app.name').toUpperCase()}
          </Text>
        </View>

        <View style={styles.center}>
          <Text
            variant="displaySmall"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            {t('onboarding.welcome.headline')}
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.body, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('onboarding.welcome.body')}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => router.push('/(onboarding)/identity')}
          contentStyle={styles.btnContent}
          style={styles.btn}
        >
          {t('onboarding.welcome.start')}
        </Button>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: 12, marginTop: 20 },
  emoji: { fontSize: 72 },
  center: { gap: 16, paddingHorizontal: 4 },
  title: { textAlign: 'center', fontWeight: '800', lineHeight: 42 },
  body: { textAlign: 'center', lineHeight: 26 },
  btnContent: { paddingVertical: 8 },
  btn: { borderRadius: 999, marginBottom: 12 },
});
