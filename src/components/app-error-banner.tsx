import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppErrorStore } from '@/store/app-error-store';

export function AppErrorBanner() {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentError = useAppErrorStore((s) => s.currentError);
  const clearAppError = useAppErrorStore((s) => s.clearAppError);

  return (
    <Snackbar
      visible={!!currentError}
      onDismiss={clearAppError}
      action={
        currentError?.retryLabelKey
          ? { label: t(currentError.retryLabelKey), onPress: clearAppError }
          : undefined
      }
      duration={4500}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
      wrapperStyle={{ bottom: 12 }}
      theme={{ colors: { inverseOnSurface: theme.colors.onSurface } }}
    >
      {currentError ? t(currentError.messageKey) : ''}
    </Snackbar>
  );
}
