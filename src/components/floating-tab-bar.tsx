import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { haptic } from '@/utils/haptics';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const ICONS: Record<string, IconName> = {
  index: 'sprout',
  progress: 'chart-line',
  settings: 'cog-outline',
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const expanded = width >= 700;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: insets.bottom + (expanded ? 18 : 12) }]}
    >
      <View
        style={[
          styles.bar,
          expanded && styles.barExpanded,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.dark ? '#000' : '#1F1A2E',
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icon = ICONS[route.name] ?? 'circle-small';
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              void haptic.selection();
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
              style={[
                styles.button,
                expanded && styles.buttonExpanded,
                focused && { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              {expanded ? (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    {
                      color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  barExpanded: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonExpanded: {
    width: 124,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  label: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
