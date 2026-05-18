import React, { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { pickQuoteForDay } from '@/data/motivational-quotes';
import { todayKey } from '@/utils/date-helpers';

export function MotivationCard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const quote = useMemo(() => pickQuoteForDay(todayKey()), []);

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.icon}>✦</Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.primary, letterSpacing: 0.8 }}
          >
            {t('quotes.section').toUpperCase()}
          </Text>
        </View>
        <Text variant="titleMedium" style={[styles.text, { color: theme.colors.onSurface }]}>
          “{quote.text}”
        </Text>
        {quote.author ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            — {quote.author}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${t('quotes.source')}: ${quote.sourceTitle}`}
          onPress={() => {
            void Linking.openURL(quote.sourceUrl);
          }}
          style={styles.source}
        >
          <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
            {t('quotes.source')}: {quote.sourceTitle}
          </Text>
        </Pressable>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  content: { gap: 6, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontSize: 14 },
  source: { alignSelf: 'flex-start', marginTop: 2 },
  text: { lineHeight: 24 },
});
