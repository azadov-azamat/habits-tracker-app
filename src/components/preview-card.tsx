import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'neutral';

type Props = {
  tone?: Tone;
  emoji?: string;
  label?: string;
  centered?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PreviewCard({ tone = 'primary', emoji, label, centered, children, style }: Props) {
  const theme = useTheme();

  const { backgroundColor, accent } = (() => {
    switch (tone) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondaryContainer,
          accent: theme.colors.onSecondaryContainer,
        };
      case 'tertiary':
        return {
          backgroundColor: theme.colors.tertiaryContainer,
          accent: theme.colors.onTertiaryContainer,
        };
      case 'neutral':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          accent: theme.colors.onSurfaceVariant,
        };
      default:
        return {
          backgroundColor: theme.colors.primaryContainer,
          accent: theme.colors.onPrimaryContainer,
        };
    }
  })();

  return (
    <View style={[styles.card, { backgroundColor }, centered && styles.cardCentered, style]}>
      {label && !centered ? (
        <Text
          variant="labelMedium"
          style={[styles.label, { color: accent }]}
        >
          {label.toUpperCase()}
        </Text>
      ) : null}
      <View style={[styles.body, centered && styles.bodyCentered]}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  cardCentered: { alignItems: 'center' },
  emoji: { fontSize: 28 },
  label: { letterSpacing: 1 },
  body: { gap: 6 },
  bodyCentered: { alignItems: 'center' },
});
