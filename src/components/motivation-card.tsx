import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Portal, Modal, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { pickQuoteForDay } from '@/data/motivational-quotes';
import { todayKey } from '@/utils/date-helpers';

type Props = {
  variant?: 'link' | 'inline';
};

export function MotivationCard({ variant = 'link' }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const quote = useMemo(() => pickQuoteForDay(todayKey()), []);
  const [open, setOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <View
        style={[
          styles.inlineCard,
          {
            backgroundColor: theme.colors.secondaryContainer,
          },
        ]}
      >
        <View style={styles.inlineHeader}>
          <Text style={[styles.sparkleSmall, { color: theme.colors.onSecondaryContainer }]}>
            ✦
          </Text>
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.onSecondaryContainer, letterSpacing: 1 }}
          >
            {t('quotes.section').toUpperCase()}
          </Text>
        </View>
        <Text
          variant="titleMedium"
          style={[styles.inlineQuote, { color: theme.colors.onSecondaryContainer }]}
        >
          “{quote.text}”
        </Text>
        {quote.author ? (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSecondaryContainer, opacity: 0.7 }}
          >
            — {quote.author}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${t('quotes.source')}: ${quote.sourceTitle}`}
          onPress={() => {
            void Linking.openURL(quote.sourceUrl);
          }}
          style={styles.inlineSource}
        >
          <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
            {t('quotes.source')}: {quote.sourceTitle}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('quotes.section')}
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <Text style={styles.icon}>✦</Text>
        <Text
          variant="labelLarge"
          style={{ color: theme.colors.primary, letterSpacing: 0.6 }}
        >
          {t('quotes.section')}
        </Text>
      </Pressable>

      <Portal>
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.sparkle, { color: theme.colors.primary }]}>✦</Text>
          <Text variant="titleMedium" style={[styles.quote, { color: theme.colors.onSurface }]}>
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
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  icon: { fontSize: 14 },
  modal: {
    margin: 20,
    padding: 28,
    borderRadius: 28,
    gap: 12,
    alignItems: 'center',
  },
  sparkle: { fontSize: 28 },
  quote: { lineHeight: 26, textAlign: 'center' },
  source: { alignSelf: 'center', marginTop: 8 },

  inlineCard: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  inlineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sparkleSmall: { fontSize: 16 },
  inlineQuote: { lineHeight: 26, fontWeight: '600' },
  inlineSource: { alignSelf: 'flex-start', marginTop: 4 },
});
