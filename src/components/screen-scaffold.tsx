import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 700;
  const contentMaxWidth = width >= 1000 ? 760 : 680;
  const edges: ('top' | 'bottom' | 'left' | 'right')[] = ['left', 'right'];
  if (topInset) edges.push('top');
  if (bottomInset) edges.push('bottom');

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.contentFrame,
          isTablet && [styles.contentFrameTablet, { maxWidth: contentMaxWidth }],
          contentStyle,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  ) : (
    <View style={[styles.staticContainer, isTablet && styles.staticContainerTablet]}>
      <View
        style={[
          styles.staticFrame,
          isTablet && { maxWidth: contentMaxWidth },
        ]}
      >
        {children}
      </View>
    </View>
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
          <View
            style={[
              styles.footerContent,
              isTablet && [styles.footerContentTablet, { maxWidth: contentMaxWidth }],
            ]}
          >
            {footer}
          </View>
        </View>
      ) : null}
      <AppErrorBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentFrame: {
    width: '100%',
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  contentFrameTablet: {
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 56,
  },
  staticContainer: { flex: 1 },
  staticContainerTablet: { alignItems: 'center' },
  staticFrame: { flex: 1, width: '100%' },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  footerContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  footerContentTablet: {
    paddingHorizontal: 28,
  },
});
