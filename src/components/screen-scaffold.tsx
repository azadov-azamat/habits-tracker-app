import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppErrorBanner } from '@/components/app-error-banner';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ScrollViewProps['contentContainerStyle'];
  footer?: React.ReactNode;
  footerStyle?: ViewStyle;
  topInset?: boolean;
  bottomInset?: boolean;
};

export function ScreenScaffold({
  children,
  scroll = true,
  contentStyle,
  footer,
  footerStyle,
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
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.outlineVariant,
            },
            footerStyle,
          ]}
        >
          {footer}
        </View>
      ) : null}
      <AppErrorBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
