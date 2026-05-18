import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useNotificationHandler } from '@/hooks/use-notification-handler';
import { useDailyReconcile } from '@/hooks/use-daily-reconcile';
import { safeEnsureNotificationSetup } from '@/services/notifications';

void SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const theme = useAppTheme();
  useNotificationHandler();
  useDailyReconcile();

  useEffect(() => {
    void (async () => {
      await safeEnsureNotificationSetup();
      await SplashScreen.hideAsync().catch(() => {});
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={theme}>
            <StatusBar style={theme.dark ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
                animation: 'fade',
              }}
            />
          </PaperProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
