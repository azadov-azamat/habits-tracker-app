import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type Props = {
  minimalVersion: string;
  onAccept: () => void;
};

export function MinimumViableCard({ minimalVersion, onAccept }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card
      mode="contained"
      style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.icon}>🌿</Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}
          >
            {t('home.minimalCard.title')}
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
          {t('home.minimalCard.body')}
        </Text>
        <Text
          variant="titleMedium"
          style={[styles.minimal, { color: theme.colors.onPrimaryContainer }]}
        >
          “{minimalVersion}”
        </Text>
        <Button
          mode="contained-tonal"
          onPress={onAccept}
          style={styles.button}
        >
          {t('home.minimalCard.action')}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  content: { gap: 10, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  minimal: { fontStyle: 'italic' },
  button: { alignSelf: 'flex-start', marginTop: 4 },
});
