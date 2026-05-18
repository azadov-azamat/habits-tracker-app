import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Card, Divider, List, SegmentedButtons, Switch, Text, useTheme } from 'react-native-paper';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@/components/screen-scaffold';
import { useSettingsStore } from '@/store/settings-store';
import { useHabitsStore } from '@/store/habits-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { safeCancelAllNotifications } from '@/services/notifications';
import { TimePicker } from '@/components/time-interval-picker';

export default function SettingsTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const settings = useSettingsStore();
  const habitsClear = useHabitsStore((s) => s.clearAll);
  const onboardingReset = useOnboardingStore((s) => s.reset);
  const [showMorningTime, setShowMorningTime] = useState(false);

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

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('settings.appearance')}
          </Text>
          <SegmentedButtons
            value={settings.theme}
            onValueChange={(v) => settings.setTheme(v as 'system' | 'light' | 'dark')}
            buttons={[
              { value: 'system', label: t('settings.themeSystem') },
              { value: 'light', label: t('settings.themeLight') },
              { value: 'dark', label: t('settings.themeDark') },
            ]}
          />
        </Card.Content>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('settings.notifications')}
          </Text>
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
            showMorningTime ? (
              <TimePicker
                label={t('settings.morningGreetingTime')}
                value={settings.morningGreetingTime}
                onChange={settings.setMorningGreetingTime}
              />
            ) : (
              <List.Item
                title={t('settings.morningGreetingTime')}
                description={settings.morningGreetingTime}
                onPress={() => setShowMorningTime(true)}
                right={(p) => <List.Icon {...p} icon="pencil" />}
                style={styles.item}
              />
            )
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
        </Card.Content>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('settings.data')}
          </Text>
          <List.Item
            title={t('settings.clearData')}
            description={t('settings.clearDataConfirm')}
            descriptionNumberOfLines={3}
            onPress={confirmClear}
            titleStyle={{ color: theme.colors.error }}
            left={(p) => <List.Icon {...p} icon="delete-outline" color={theme.colors.error} />}
            style={styles.item}
          />
        </Card.Content>
      </Card>

      <View style={styles.about}>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('settings.version')}: {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  section: { gap: 12, paddingVertical: 8 },
  item: { paddingHorizontal: 0 },
  about: { alignItems: 'center', paddingVertical: 16 },
});
