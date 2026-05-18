import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressMeter({ current, total, label }: Props) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(1, current / total), { duration: 700 });
  }, [current, total, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {label ? (
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {label}
          </Text>
        ) : null}
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          {current} / {total}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: theme.colors.primary }, fillStyle]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 10, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});
