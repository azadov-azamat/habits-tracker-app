import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Divider, List, Modal, Portal, Switch, Text, useTheme } from 'react-native-paper';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { AppButton } from '@/components/app-button';
import { useSettingsStore } from '@/store/settings-store';
import { useHabitsStore } from '@/store/habits-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { safeCancelAllNotifications } from '@/services/notifications';
import { TimePicker } from '@/components/time-interval-picker';

type ThemeChoice = 'system' | 'light' | 'dark';

export default function SettingsTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const settings = useSettingsStore();
  const habitsClear = useHabitsStore((s) => s.clearAll);
  const onboardingReset = useOnboardingStore((s) => s.reset);

  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

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
    <ScreenScaffold>
      <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
        {t('settings.title')}
      </Text>

      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>
          {t('settings.appearance')}
        </List.Subheader>
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

      <View style={styles.about}>
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
  section: { marginVertical: 0 },
  subheader: { paddingHorizontal: 4, fontWeight: '700' },
  item: { paddingHorizontal: 8 },
  about: { alignItems: 'center', paddingVertical: 16 },
  modal: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    gap: 8,
  },
  modalItem: { paddingHorizontal: 0 },
});
