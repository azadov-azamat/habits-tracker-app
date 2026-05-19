import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type Props = {
  totalCount: number;
  doneCount: number;
  canAdd: boolean;
  onPress: () => void;
};

export function MicroHabitsChip({ totalCount, doneCount, canAdd, onPress }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const isEmpty = totalCount === 0;
  const label = t('home.microHabitsTitle');
  const counter = isEmpty ? t('home.addMicroHabit') : `${doneCount}/${totalCount}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${counter}`}
      style={[styles.row, { borderTopColor: theme.colors.outlineVariant }]}
    >
      <View style={styles.left}>
        <MaterialCommunityIcons
          name={isEmpty ? 'plus-circle-outline' : 'flash-outline'}
          size={18}
          color={theme.colors.primary}
        />
        <Text
          variant="titleSmall"
          style={{ color: theme.colors.onSurface, fontWeight: '600' }}
        >
          {label}
        </Text>
      </View>
      <View style={styles.right}>
        <Text
          variant="labelMedium"
          style={{ color: isEmpty ? theme.colors.primary : theme.colors.onSurfaceVariant }}
        >
          {counter}
          {!isEmpty && canAdd ? ' ·  +' : ''}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
