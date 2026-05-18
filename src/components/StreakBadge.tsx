import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
  streak: number;
  label?: string;
};

export function StreakBadge({ streak, label }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
      <Text style={styles.emoji}>🔥</Text>
      <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
        {streak}
      </Text>
      {label ? (
        <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  emoji: { fontSize: 20 },
});
