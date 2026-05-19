import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppButton } from '@/components/app-button';

type Props = {
  emoji?: string;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ emoji = '🌱', title, body, actionLabel, onAction }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title}
      </Text>
      {body ? (
        <Text
          variant="bodyMedium"
          style={[styles.body, { color: theme.colors.onSurfaceVariant }]}
        >
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton onPress={onAction} style={styles.button}>
          {actionLabel}
        </AppButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    flex: 1,
  },
  emoji: { fontSize: 48 },
  title: { textAlign: 'center', fontWeight: '700' },
  body: { textAlign: 'center', lineHeight: 22 },
  button: { marginTop: 8 },
});
