import React from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppErrorBanner } from '@/components/app-error-banner';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ScrollViewProps['contentContainerStyle'];
  topInset?: boolean;
  bottomInset?: boolean;
};

export function ScreenScaffold({
  children,
  scroll = true,
  contentStyle,
  topInset = true,
  bottomInset = true,
}: Props) {
  const theme = useTheme();
  const edges: ('top' | 'bottom' | 'left' | 'right')[] = ['left', 'right'];
  if (topInset) edges.push('top');
  if (bottomInset) edges.push('bottom');

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flex}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      {body}
      <AppErrorBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
});
