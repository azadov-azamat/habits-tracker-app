import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type Props = {
  twoInARow: boolean;
  onDismiss?: () => void;
};

export function RecoveryCard({ twoInARow, onDismiss }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const key = twoInARow ? 'twoMissedCard' : 'missedCard';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>🌧️</Text>
        <Text
          variant="titleSmall"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {t(`home.${key}.title`)}
        </Text>
        {onDismiss ? (
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={t('common.done')}
            hitSlop={8}
            style={styles.dismiss}
          >
            <Text style={[styles.dismissText, { color: theme.colors.onSurfaceVariant }]}>×</Text>
          </Pressable>
        ) : null}
      </View>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {t(`home.${key}.body`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  title: { fontWeight: '700', flex: 1 },
  dismiss: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: { fontSize: 22, lineHeight: 24 },
});
