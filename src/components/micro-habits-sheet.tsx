import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app-button';
import { MicroHabitRow } from '@/components/micro-habit-row';
import type { Habit } from '@/store/types';

type Props = {
  visible: boolean;
  onClose: () => void;
  microHabits: Habit[];
  canAdd: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
};

export function MicroHabitsSheet({
  visible,
  onClose,
  microHabits,
  canAdd,
  onToggle,
  onOpen,
  onAdd,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        style={styles.modalRoot}
        contentContainerStyle={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View
          style={[styles.handle, { backgroundColor: theme.colors.outline }]}
          accessibilityElementsHidden
        />
        <View style={styles.header}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '700' }}
          >
            {t('home.microHabitsTitle')}
          </Text>
          {canAdd ? (
            <AppButton
              variant="ghost"
              size="small"
              icon="plus"
              compact
              onPress={() => {
                onClose();
                onAdd();
              }}
            >
              {t('home.addMicroHabit')}
            </AppButton>
          ) : null}
        </View>

        {microHabits.length === 0 ? (
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, paddingHorizontal: 4, paddingVertical: 12 }}
          >
            {t('home.microEmpty')}
          </Text>
        ) : (
          <View style={styles.list}>
            {microHabits.map((mh) => (
              <MicroHabitRow
                key={mh.id}
                habit={mh}
                onToggle={onToggle}
                onOpen={(id) => {
                  onClose();
                  onOpen(id);
                }}
              />
            ))}
          </View>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { justifyContent: 'flex-end', margin: 0 },
  sheet: {
    marginHorizontal: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  list: { gap: 8 },
});
