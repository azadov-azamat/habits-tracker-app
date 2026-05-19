import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { saplingStageFor, saplingVitality, type SaplingStage } from '@/services/sapling-stage';

type Props = {
  currentDay: number;
  completionRate: number;
  emoji?: string;
  size?: number;
  animateKey?: number;
};

const VIEWBOX_W = 120;
const VIEWBOX_H = 160;

export const Sapling = React.memo(function Sapling({
  currentDay,
  completionRate,
  emoji,
  size = 160,
  animateKey = 0,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const stage = saplingStageFor(currentDay);
  const vitality = saplingVitality(completionRate);

  const potColor = theme.colors.surfaceVariant;
  const potShadow = theme.colors.outline;
  const soilColor = theme.colors.outlineVariant;
  const stemColor = theme.colors.onTertiaryContainer;
  const flowerColor = theme.colors.secondary;
  const leafColor = theme.colors.tertiary;
  const leafOpacity = 0.55 + vitality * 0.45;
  const droopDeg = (1 - vitality) * 12;
  const glowOpacity = Math.max(0, vitality - 0.5) * 0.32;

  const scale = useSharedValue(1);
  const stageOpacity = useSharedValue(1);

  useEffect(() => {
    stageOpacity.value = 0;
    stageOpacity.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
  }, [stage, stageOpacity]);

  useEffect(() => {
    if (animateKey > 0) {
      scale.value = withSequence(
        withTiming(1.04, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    }
  }, [animateKey, scale]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stageStyle = useAnimatedStyle(() => ({
    opacity: stageOpacity.value,
  }));

  const a11yLabel = t('home.saplingA11y', { day: Math.max(0, currentDay), total: 40 });

  return (
    <View
      accessible
      accessibilityLabel={a11yLabel}
      accessibilityRole="image"
      style={[styles.wrap, { width: size, height: (size * VIEWBOX_H) / VIEWBOX_W }]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, wrapStyle]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}>
          <Defs>
            <LinearGradient id="potGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={potColor} stopOpacity={1} />
              <Stop offset="1" stopColor={potShadow} stopOpacity={0.85} />
            </LinearGradient>
            <RadialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor={leafColor} stopOpacity={0.55} />
              <Stop offset="1" stopColor={leafColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Glow (vitality-driven) */}
          <Circle cx={60} cy={78} r={56} fill="url(#glow)" opacity={glowOpacity} />

          {/* Ground shadow */}
          <Ellipse cx={60} cy={152} rx={42} ry={3} fill={stemColor} opacity={0.08} />

          {/* Pot */}
          <Path
            d="M38 112 L82 112 L76 148 L44 148 Z"
            fill="url(#potGradient)"
          />
          {/* Pot rim */}
          <Ellipse cx={60} cy={112} rx={22} ry={3.5} fill={potColor} />
          {/* Soil top */}
          <Ellipse cx={60} cy={111} rx={20} ry={2.6} fill={soilColor} />

          {/* Habit emoji on pot face */}
          {emoji ? (
            <SvgText
              x={60}
              y={134}
              fontSize={14}
              textAnchor="middle"
              fill={stemColor}
              opacity={0.85}
            >
              {emoji}
            </SvgText>
          ) : null}

        </Svg>
      </Animated.View>

      {/* Stage layer — separate Svg for fade-in animation on stage change */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, stageStyle]}
      >
        <Svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}>
          <StageContent
            stage={stage}
            leafColor={leafColor}
            leafOpacity={leafOpacity}
            stemColor={stemColor}
            flowerColor={flowerColor}
            droopDeg={droopDeg}
          />
        </Svg>
      </Animated.View>
    </View>
  );
});

type StageProps = {
  stage: SaplingStage;
  leafColor: string;
  leafOpacity: number;
  stemColor: string;
  flowerColor: string;
  droopDeg: number;
};

function StageContent({
  stage,
  leafColor,
  leafOpacity,
  stemColor,
  flowerColor,
  droopDeg,
}: StageProps) {
  if (stage === 0) {
    return <Circle cx={60} cy={110} r={1.8} fill={stemColor} opacity={0.6} />;
  }

  if (stage === 1) {
    return (
      <G opacity={leafOpacity}>
        <Path
          d="M60 109 C 58 104 58 100 60 96"
          stroke={stemColor}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Ellipse cx={60} cy={94} rx={3.6} ry={2.6} fill={leafColor} />
      </G>
    );
  }

  if (stage === 2) {
    return (
      <G>
        <Path d="M60 110 L60 86" stroke={stemColor} strokeWidth={2} strokeLinecap="round" />
        <G transform={`rotate(${-22 - droopDeg} 53 84)`} opacity={leafOpacity}>
          <Ellipse cx={53} cy={84} rx={8} ry={4.5} fill={leafColor} />
        </G>
        <G transform={`rotate(${22 + droopDeg} 67 84)`} opacity={leafOpacity}>
          <Ellipse cx={67} cy={84} rx={8} ry={4.5} fill={leafColor} />
        </G>
      </G>
    );
  }

  if (stage === 3) {
    return (
      <G>
        <Path d="M60 110 L60 68" stroke={stemColor} strokeWidth={2.2} strokeLinecap="round" />
        <G transform={`rotate(${-28 - droopDeg} 51 92)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={51} cy={92} rx={6.5} ry={3.6} fill={leafColor} />
        </G>
        <G transform={`rotate(${28 + droopDeg} 69 92)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={69} cy={92} rx={6.5} ry={3.6} fill={leafColor} />
        </G>
        <G transform={`rotate(${-35 - droopDeg} 50 76)`} opacity={leafOpacity}>
          <Ellipse cx={50} cy={76} rx={9} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${35 + droopDeg} 70 76)`} opacity={leafOpacity}>
          <Ellipse cx={70} cy={76} rx={9} ry={4} fill={leafColor} />
        </G>
      </G>
    );
  }

  if (stage === 4) {
    return (
      <G>
        <Path d="M60 110 L60 54" stroke={stemColor} strokeWidth={2.4} strokeLinecap="round" />
        <G transform={`rotate(${-28 - droopDeg} 49 94)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={49} cy={94} rx={7} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${28 + droopDeg} 71 94)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={71} cy={94} rx={7} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${-38 - droopDeg} 48 78)`} opacity={leafOpacity}>
          <Ellipse cx={48} cy={78} rx={10} ry={4.5} fill={leafColor} />
        </G>
        <G transform={`rotate(${38 + droopDeg} 72 78)`} opacity={leafOpacity}>
          <Ellipse cx={72} cy={78} rx={10} ry={4.5} fill={leafColor} />
        </G>
        <G transform={`rotate(${-44 - droopDeg} 52 62)`} opacity={leafOpacity}>
          <Ellipse cx={52} cy={62} rx={8} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${44 + droopDeg} 68 62)`} opacity={leafOpacity}>
          <Ellipse cx={68} cy={62} rx={8} ry={4} fill={leafColor} />
        </G>
      </G>
    );
  }

  if (stage === 5) {
    return (
      <G>
        <Path d="M60 110 L60 44" stroke={stemColor} strokeWidth={2.4} strokeLinecap="round" />
        <G transform={`rotate(${-28 - droopDeg} 49 94)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={49} cy={94} rx={7} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${28 + droopDeg} 71 94)`} opacity={leafOpacity * 0.85}>
          <Ellipse cx={71} cy={94} rx={7} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${-38 - droopDeg} 48 78)`} opacity={leafOpacity}>
          <Ellipse cx={48} cy={78} rx={10} ry={4.5} fill={leafColor} />
        </G>
        <G transform={`rotate(${38 + droopDeg} 72 78)`} opacity={leafOpacity}>
          <Ellipse cx={72} cy={78} rx={10} ry={4.5} fill={leafColor} />
        </G>
        <G transform={`rotate(${-44 - droopDeg} 52 62)`} opacity={leafOpacity}>
          <Ellipse cx={52} cy={62} rx={9} ry={4} fill={leafColor} />
        </G>
        <G transform={`rotate(${44 + droopDeg} 68 62)`} opacity={leafOpacity}>
          <Ellipse cx={68} cy={62} rx={9} ry={4} fill={leafColor} />
        </G>
        {/* Bud */}
        <Circle cx={60} cy={40} r={3.6} fill={flowerColor} opacity={0.8} />
        <Path
          d="M60 36 C 58 40 58 42 60 44 C 62 42 62 40 60 36 Z"
          fill={leafColor}
          opacity={leafOpacity * 0.8}
        />
      </G>
    );
  }

  // stage === 6 — flower
  return (
    <G>
      <Path d="M60 110 L60 44" stroke={stemColor} strokeWidth={2.4} strokeLinecap="round" />
      <G transform={`rotate(${-28 - droopDeg} 49 94)`} opacity={leafOpacity * 0.85}>
        <Ellipse cx={49} cy={94} rx={7} ry={4} fill={leafColor} />
      </G>
      <G transform={`rotate(${28 + droopDeg} 71 94)`} opacity={leafOpacity * 0.85}>
        <Ellipse cx={71} cy={94} rx={7} ry={4} fill={leafColor} />
      </G>
      <G transform={`rotate(${-38 - droopDeg} 48 78)`} opacity={leafOpacity}>
        <Ellipse cx={48} cy={78} rx={10} ry={4.5} fill={leafColor} />
      </G>
      <G transform={`rotate(${38 + droopDeg} 72 78)`} opacity={leafOpacity}>
        <Ellipse cx={72} cy={78} rx={10} ry={4.5} fill={leafColor} />
      </G>
      <G transform={`rotate(${-44 - droopDeg} 52 62)`} opacity={leafOpacity}>
        <Ellipse cx={52} cy={62} rx={9} ry={4} fill={leafColor} />
      </G>
      <G transform={`rotate(${44 + droopDeg} 68 62)`} opacity={leafOpacity}>
        <Ellipse cx={68} cy={62} rx={9} ry={4} fill={leafColor} />
      </G>
      {/* Flower: 5 petals around center */}
      <Ellipse cx={60} cy={32} rx={4.5} ry={6} fill={flowerColor} />
      <G transform="rotate(72 60 40)">
        <Ellipse cx={60} cy={32} rx={4.5} ry={6} fill={flowerColor} />
      </G>
      <G transform="rotate(144 60 40)">
        <Ellipse cx={60} cy={32} rx={4.5} ry={6} fill={flowerColor} />
      </G>
      <G transform="rotate(216 60 40)">
        <Ellipse cx={60} cy={32} rx={4.5} ry={6} fill={flowerColor} />
      </G>
      <G transform="rotate(288 60 40)">
        <Ellipse cx={60} cy={32} rx={4.5} ry={6} fill={flowerColor} />
      </G>
      <Circle cx={60} cy={40} r={3} fill={stemColor} />
    </G>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
});
