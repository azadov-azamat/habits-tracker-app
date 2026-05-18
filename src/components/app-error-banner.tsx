import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppErrorStore } from '@/store/app-error-store';

export function AppErrorBanner() {
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
    >
      {currentError ? t(currentError.messageKey) : ''}
    </Snackbar>
  );
}
