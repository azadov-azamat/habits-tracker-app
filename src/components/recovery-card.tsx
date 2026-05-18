import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type Props = {
  twoInARow: boolean;
};

export function RecoveryCard({ twoInARow }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const key = twoInARow ? 'twoMissedCard' : 'missedCard';
  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        { backgroundColor: theme.dark ? '#2A2438' : '#F4EFFA' },
      ]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.icon}>🌧️</Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '700' }}
          >
            {t(`home.${key}.title`)}
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {t(`home.${key}.body`)}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  content: { gap: 8, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
});
