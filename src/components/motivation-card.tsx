import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Portal, Modal, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { pickQuoteForDay } from '@/data/motivational-quotes';
import { todayKey } from '@/utils/date-helpers';
import { useSettingsStore } from '@/store/settings-store';

type Props = {
  variant?: 'link' | 'inline';
};

export function MotivationCard({ variant = 'link' }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const quote = useMemo(() => pickQuoteForDay(todayKey(), language), [language]);
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
            variant="labelSmall"
            style={{ color: theme.colors.onSecondaryContainer, letterSpacing: 1, opacity: 0.8 }}
          >
            {t('quotes.section').toUpperCase()}
          </Text>
        </View>
        <Text
          variant="bodyMedium"
          style={[styles.inlineQuote, { color: theme.colors.onSecondaryContainer }]}
        >
          “{quote.text}”
        </Text>
        <View style={styles.inlineFooter}>
          {quote.author ? (
            <Text
              variant="labelSmall"
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
          >
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.onSecondaryContainer,
                opacity: 0.7,
                textDecorationLine: 'underline',
              }}
            >
              {quote.sourceTitle}
            </Text>
          </Pressable>
        </View>
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
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  inlineHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sparkleSmall: { fontSize: 13 },
  inlineQuote: { lineHeight: 21, fontWeight: '600' },
  inlineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
});
