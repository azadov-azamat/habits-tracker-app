import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { haptic } from '@/utils/haptics';

type Props = {
  done: boolean;
  onCheckIn: () => void;
  onUndo: () => void;
  doneLabel: string;
  pendingLabel: string;
  undoLabel: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CheckInButton({ done, onCheckIn, onUndo, doneLabel, pendingLabel, undoLabel }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!done) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [done, pulse]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.15 + pulse.value * 0.25,
    transform: [{ scale: 1 + pulse.value * 0.05 }],
  }));

  function press() {
    scale.value = withSequence(
      withTiming(0.94, { duration: 90 }),
      withSpring(1, { damping: 8, stiffness: 220 }),
    );
    if (done) {
      void haptic.selection();
      onUndo();
    } else {
      void haptic.success();
      onCheckIn();
    }
  }

  const bg = done ? theme.colors.tertiary : theme.colors.primary;
  const fg = done ? theme.colors.onTertiary : theme.colors.onPrimary;

  return (
    <View style={styles.wrapper}>
      {!done && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.glow,
            { backgroundColor: theme.colors.primary },
            glowStyle,
          ]}
        />
      )}
      <AnimatedPressable
        onPress={press}
        accessibilityRole="button"
        accessibilityLabel={done ? doneLabel : pendingLabel}
        style={[styles.button, { backgroundColor: bg }, animStyle]}
      >
        <Text variant="titleLarge" style={[styles.icon, { color: fg }]}>
          {done ? '✓' : '○'}
        </Text>
        <Text variant="titleMedium" style={{ color: fg, fontWeight: '700' }}>
          {done ? doneLabel : pendingLabel}
        </Text>
      </AnimatedPressable>
      {done && (
        <Pressable
          onPress={press}
          accessibilityRole="button"
          accessibilityLabel={undoLabel}
          style={[
            styles.undo,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {undoLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'stretch' },
  glow: { borderRadius: 999 },
  button: {
    minHeight: 64,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: { fontSize: 24 },
  undo: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
