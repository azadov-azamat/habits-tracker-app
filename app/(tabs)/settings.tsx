import React, { useState } from 'react';
import { Alert, Image, Linking, StyleSheet, View } from 'react-native';
import { Divider, List, Modal, Portal, Switch, Text, useTheme } from 'react-native-paper';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { AppButton } from '@/components/app-button';
import { useSettingsStore } from '@/store/settings-store';
import { useHabitsStore } from '@/store/habits-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { safeCancelAllNotifications } from '@/services/notifications';
import { TimePicker } from '@/components/time-interval-picker';
import type { LanguageMode } from '@/store/types';

type ThemeChoice = 'system' | 'light' | 'dark';
type LanguageChoice = LanguageMode;
const PRIVACY_POLICY_URL = 'https://azadov-azamat.github.io/habits-tracker-app/privacy-policy.html';

export default function SettingsTab() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const settings = useSettingsStore();
  const habitsClear = useHabitsStore((s) => s.clearAll);
  const onboardingReset = useOnboardingStore((s) => s.reset);

  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const languageLabel =
    settings.language === 'en' ? t('settings.languageEn') : t('settings.languageUz');
  const themeLabel =
    settings.theme === 'light'
      ? t('settings.themeLight')
      : settings.theme === 'dark'
        ? t('settings.themeDark')
        : t('settings.themeSystem');

  function confirmClear() {
    Alert.alert(
      t('settings.clearData'),
      t('settings.clearDataConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await safeCancelAllNotifications();
            habitsClear();
            onboardingReset();
          },
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <ScreenScaffold contentStyle={styles.scrollContent} bottomInset={false}>
      <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
        {t('settings.title')}
      </Text>

      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>
          {t('settings.appearance')}
        </List.Subheader>
        <List.Item
          title={t('settings.language')}
          description={languageLabel}
          onPress={() => setLanguagePickerOpen(true)}
          right={(p) => <List.Icon {...p} icon="chevron-right" />}
          style={styles.item}
        />
        <Divider />
        <List.Item
          title={t('settings.theme')}
          description={themeLabel}
          onPress={() => setThemePickerOpen(true)}
          right={(p) => <List.Icon {...p} icon="chevron-right" />}
          style={styles.item}
        />
      </List.Section>

      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>
          {t('settings.notifications')}
        </List.Subheader>
        <List.Item
          title={t('settings.notificationsEnabled')}
          right={() => (
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={settings.setNotificationsEnabled}
            />
          )}
          style={styles.item}
        />
        <Divider />
        <List.Item
          title={t('settings.morningGreeting')}
          right={() => (
            <Switch
              value={settings.morningGreetingEnabled}
              onValueChange={settings.setMorningGreetingEnabled}
            />
          )}
          style={styles.item}
        />
        {settings.morningGreetingEnabled ? (
          <>
            <Divider />
            <List.Item
              title={t('settings.morningGreetingTime')}
              description={settings.morningGreetingTime}
              onPress={() => setTimePickerOpen(true)}
              right={(p) => <List.Icon {...p} icon="chevron-right" />}
              style={styles.item}
            />
          </>
        ) : null}
        <Divider />
        <List.Item
          title={t('settings.haptics')}
          right={() => (
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={settings.setHapticsEnabled}
            />
          )}
          style={styles.item}
        />
      </List.Section>

      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>
          {t('settings.data')}
        </List.Subheader>
        <List.Item
          title={t('settings.clearData')}
          description={t('settings.clearDataConfirm')}
          descriptionNumberOfLines={2}
          onPress={confirmClear}
          titleStyle={{ color: theme.colors.error }}
          left={(p) => <List.Icon {...p} icon="delete-outline" color={theme.colors.error} />}
          style={styles.item}
        />
      </List.Section>

      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>
          {t('settings.about')}
        </List.Subheader>
        <List.Item
          title={t('settings.privacyPolicy')}
          description={t('settings.privacyPolicyDescription')}
          onPress={() => {
            void Linking.openURL(`${PRIVACY_POLICY_URL}?lang=${settings.language}`);
          }}
          right={(p) => <List.Icon {...p} icon="open-in-new" />}
          style={styles.item}
        />
      </List.Section>

      {__DEV__ ? (
        <List.Section style={styles.section}>
          <List.Subheader style={styles.subheader}>
            {t('settings.developer')}
          </List.Subheader>
          <AppButton
            variant="secondary"
            icon="arrow-left-circle-outline"
            fullWidth
            onPress={() => router.push('/(onboarding)/welcome')}
          >
            {t('settings.openOnboarding')}
          </AppButton>
        </List.Section>
      ) : null}

      <View style={styles.about}>
        <Image
          source={require('../../assets/brand/qirqkun-logo.png')}
          resizeMode="contain"
          style={styles.aboutLogo}
        />
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          {t('app.name')}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
          {t('app.tagline')}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('settings.version')}: {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>

      <Portal>
        <Modal
          visible={themePickerOpen}
          onDismiss={() => setThemePickerOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('settings.theme')}
          </Text>
          {(['system', 'light', 'dark'] as ThemeChoice[]).map((option) => {
            const label =
              option === 'light'
                ? t('settings.themeLight')
                : option === 'dark'
                  ? t('settings.themeDark')
                  : t('settings.themeSystem');
            const selected = settings.theme === option;
            return (
              <List.Item
                key={option}
                title={label}
                onPress={() => {
                  settings.setTheme(option);
                  setThemePickerOpen(false);
                }}
                right={(p) =>
                  selected ? <List.Icon {...p} icon="check" color={theme.colors.primary} /> : null
                }
                style={styles.modalItem}
              />
            );
          })}
        </Modal>

        <Modal
          visible={languagePickerOpen}
          onDismiss={() => setLanguagePickerOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('settings.language')}
          </Text>
          {(['uz', 'en'] as LanguageChoice[]).map((option) => {
            const label = option === 'en' ? t('settings.languageEn') : t('settings.languageUz');
            const selected = settings.language === option;
            return (
              <List.Item
                key={option}
                title={label}
                onPress={() => {
                  settings.setLanguage(option);
                  setLanguagePickerOpen(false);
                }}
                right={(p) =>
                  selected ? <List.Icon {...p} icon="check" color={theme.colors.primary} /> : null
                }
                style={styles.modalItem}
              />
            );
          })}
        </Modal>

        <Modal
          visible={timePickerOpen}
          onDismiss={() => setTimePickerOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <TimePicker
            label={t('settings.morningGreetingTime')}
            value={settings.morningGreetingTime}
            onChange={settings.setMorningGreetingTime}
          />
          <AppButton fullWidth onPress={() => setTimePickerOpen(false)} style={{ marginTop: 12 }}>
            {t('common.done')}
          </AppButton>
        </Modal>
      </Portal>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, gap: 16, paddingBottom: 110 },
  section: { marginVertical: 0 },
  subheader: { paddingHorizontal: 4, fontWeight: '700' },
  item: { paddingHorizontal: 8 },
  about: { alignItems: 'center', paddingVertical: 16, gap: 4 },
  aboutLogo: { width: 64, height: 64, borderRadius: 16, marginBottom: 4 },
  modal: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    gap: 8,
  },
  modalItem: { paddingHorizontal: 0 },
});
