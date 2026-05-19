import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app-button';

type Props = {
  nextLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onNext: () => void;
  extraAction?: React.ReactNode;
};

export function OnboardingFooter({
  nextLabel,
  disabled,
  loading,
  onNext,
  extraAction,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppButton
          variant="secondary"
          onPress={() => router.back()}
          style={styles.button}
        >
          {t('common.back')}
        </AppButton>
        <AppButton
          disabled={disabled}
          loading={loading}
          onPress={onNext}
          style={styles.button}
        >
          {nextLabel ?? t('common.next')}
        </AppButton>
      </View>
      {extraAction}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', gap: 10 },
  button: { flex: 1 },
});
