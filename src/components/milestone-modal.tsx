import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import type { MilestoneDay } from '@/services/milestone-detector';
import { AppButton } from '@/components/app-button';

type Props = {
  visible: boolean;
  day: MilestoneDay | null;
  onDismiss: () => void;
  onAddNewHabit?: () => void;
};

export function MilestoneModal({ visible, day, onDismiss, onAddNewHabit }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!day) return null;
  const key = `milestones.day${day}`;
  const isFinal = day === 40;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          entering={ZoomIn.springify()}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <Animated.Text entering={FadeIn.delay(150)} style={styles.confetti}>
            🎉
          </Animated.Text>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
            {t(`${key}.title`)}
          </Text>
          <Text variant="bodyLarge" style={[styles.body, { color: theme.colors.onSurface }]}>
            {t(`${key}.body`)}
          </Text>
          <View style={styles.actions}>
            {isFinal && onAddNewHabit ? (
              <AppButton onPress={onAddNewHabit}>
                {t('milestones.day40.newHabit')}
              </AppButton>
            ) : null}
            <AppButton variant={isFinal ? 'ghost' : 'primary'} onPress={onDismiss}>
              {t('milestones.continue')}
            </AppButton>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: 28,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    gap: 14,
  },
  confetti: { fontSize: 56 },
  title: { textAlign: 'center', fontWeight: '800' },
  body: { textAlign: 'center', lineHeight: 24 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' },
});
