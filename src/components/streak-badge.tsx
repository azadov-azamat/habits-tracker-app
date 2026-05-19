import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  streak: number;
  label?: string;
  animateKey?: number;
};

export function StreakBadge({ streak, label, animateKey = 0 }: Props) {
  const theme = useTheme();
  const firstRun = useRef(true);
  const flame = useSharedValue(0);
  const [burstVisible, setBurstVisible] = React.useState(false);

  useEffect(() => {
    if (animateKey === 0 && firstRun.current) return;
    firstRun.current = false;
    setBurstVisible(true);
    flame.value = 0;
    flame.value = withSequence(
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }),
      withTiming(0.62, { duration: 120, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.92, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setBurstVisible)(false);
      }),
    );
  }, [animateKey, flame]);

  const burstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flame.value, [0, 0.14, 0.8, 1], [0, 1, 0.45, 0]),
    transform: [
      { translateY: interpolate(flame.value, [0, 1], [4, -9]) },
      { scale: interpolate(flame.value, [0, 0.55, 1], [0.88, 1.28, 1.08]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flame.value, [0, 0.2, 0.75, 1], [0, 0.55, 0.22, 0]),
    transform: [
      { translateY: interpolate(flame.value, [0, 1], [2, -4]) },
      { scale: interpolate(flame.value, [0, 1], [0.65, 1.5]) },
    ],
  }));

  const sparkLeftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flame.value, [0, 0.15, 0.85, 1], [0, 1, 0.2, 0]),
    transform: [
      { translateX: interpolate(flame.value, [0, 1], [0, -15]) },
      { translateY: interpolate(flame.value, [0, 1], [0, -23]) },
      { scale: interpolate(flame.value, [0, 0.45, 1], [0.5, 1, 0.55]) },
    ],
  }));

  const sparkRightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flame.value, [0, 0.2, 0.88, 1], [0, 1, 0.25, 0]),
    transform: [
      { translateX: interpolate(flame.value, [0, 1], [0, 13]) },
      { translateY: interpolate(flame.value, [0, 1], [0, -20]) },
      { scale: interpolate(flame.value, [0, 0.5, 1], [0.45, 0.9, 0.5]) },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
      <View style={styles.flameWrap}>
        {burstVisible ? (
          <>
            <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />
            <Animated.View style={[styles.burstFlame, burstStyle]} pointerEvents="none">
              <FlameSvg variant="burst" style={styles.svgFill} />
            </Animated.View>
            <Animated.View style={[styles.spark, styles.sparkLeft, sparkLeftStyle]} pointerEvents="none" />
            <Animated.View style={[styles.spark, styles.sparkRight, sparkRightStyle]} pointerEvents="none" />
          </>
        ) : null}
        <FlameSvg style={styles.svgFill} />
      </View>
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
  flameWrap: {
    width: 26,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  svgFill: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 150, 42, 0.55)',
  },
  burstFlame: {
    position: 'absolute',
    width: 30,
    height: 34,
  },
  spark: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFD45A',
  },
  sparkLeft: { left: 6, top: 9 },
  sparkRight: { right: 7, top: 10 },
});

function FlameSvg({
  variant = 'base',
  style,
}: {
  variant?: 'base' | 'burst';
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = variant === 'burst' ? 0.72 : 1;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 64 72" style={style}>
      <Defs>
        <LinearGradient id="outerFlame" x1="20" y1="5" x2="44" y2="68" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFCF56" />
          <Stop offset="0.38" stopColor="#FF7A1A" />
          <Stop offset="1" stopColor="#E3341D" />
        </LinearGradient>
        <LinearGradient id="innerFlame" x1="28" y1="25" x2="37" y2="62" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFF5A8" />
          <Stop offset="0.48" stopColor="#FFD447" />
          <Stop offset="1" stopColor="#FF8C1A" />
        </LinearGradient>
      </Defs>
      <G opacity={opacity}>
        <Path
          d="M32.6 4.8C30.8 13.7 21 19 17.2 27.6c-5.7 12.8.8 26.9 14.7 30.6 13.4-3.5 20.8-16.1 17-28.7-1.9-6.3-6.2-10.8-10.1-15.6-1.4 5.5-5.5 8.9-9.7 11.9 2.5-7.4 2.5-13.9 3.5-21z"
          fill="url(#outerFlame)"
        />
        <Path
          d="M33.1 27.2c-1.5 6-8.4 10-9.7 17.2-1.1 6.3 2.5 11.7 8.5 13.8 6.7-2.2 10.3-8 8.5-14.5-1-3.7-3.5-6.3-5.7-9.2-.4 3-2.5 5.4-5.2 7.4 1.7-5.1 2.5-9.7 3.6-14.7z"
          fill="url(#innerFlame)"
        />
        <Path
          d="M23.6 52.5c4.2 6.9 14.9 7.1 19.7-.2-2.8 5.3-6.8 8-11.6 8-4.5 0-7.1-2.8-8.1-7.8z"
          fill="#B91F18"
          opacity={0.24}
        />
        <Circle cx="42" cy="21" r="2.2" fill="#FFE375" opacity={0.72} />
      </G>
    </Svg>
  );
}
