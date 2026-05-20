import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { useSettingsStore } from '@/store/settings-store';
import { AppButton } from '@/components/app-button';

export default function Welcome() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const setTheme = useSettingsStore((s) => s.setTheme);
  const toggleTheme = () => setTheme(theme.dark ? 'light' : 'dark');

  return (
    <ScreenScaffold
      scroll={false}
      footer={(
        <AppButton
          onPress={() => router.push('/(onboarding)/identity')}
          fullWidth
        >
          {t('onboarding.welcome.start')}
        </AppButton>
      )}
    >
      <View style={styles.wrap}>
        <View style={styles.nav}>
          <View style={styles.brand}>
            <Image
              source={require('../../assets/brand/qirqkun-logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.primary, letterSpacing: 1.4 }}
            >
              {t('app.name').toUpperCase()}
            </Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            accessibilityLabel={theme.dark ? t('settings.themeLight') : t('settings.themeDark')}
            style={[
              styles.themeButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text style={styles.themeEmoji}>{theme.dark ? '☀️' : '🌙'}</Text>
          </Pressable>
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
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center', gap: 56 },
  nav: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { alignItems: 'center', gap: 8 },
  logo: { width: 58, height: 58, borderRadius: 14 },
  themeButton: {
    width: 48,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeEmoji: { fontSize: 20 },
  center: { gap: 16, paddingHorizontal: 4 },
  title: { textAlign: 'center', fontWeight: '800', lineHeight: 42 },
  body: { textAlign: 'center', lineHeight: 26 },
});
