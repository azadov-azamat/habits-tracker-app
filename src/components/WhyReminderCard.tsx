import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type Props = {
  why: string;
  identity?: string;
};

export function WhyReminderCard({ why, identity }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card
      mode="contained"
      style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.icon}>💛</Text>
          <Text
            variant="labelLarge"
            style={{ color: theme.colors.onSecondaryContainer, letterSpacing: 0.5 }}
          >
            {t('home.whyTitle').toUpperCase()}
          </Text>
        </View>
        <Text
          variant="titleMedium"
          style={[styles.text, { color: theme.colors.onSecondaryContainer }]}
        >
          {why}
        </Text>
        {identity ? (
          <Text
            variant="bodyMedium"
            style={[styles.identity, { color: theme.colors.onSecondaryContainer }]}
          >
            Men {identity} bo‘lib bormoqdaman.
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  content: { gap: 8, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 16 },
  text: { lineHeight: 22 },
  identity: { fontStyle: 'italic', opacity: 0.85 },
});
