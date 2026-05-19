import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { palette } from './colors';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.onPrimary,
    primaryContainer: palette.primaryContainer,
    onPrimaryContainer: palette.onPrimaryContainer,

    secondary: palette.secondary,
    onSecondary: palette.onPrimary,
    secondaryContainer: palette.secondaryContainer,
    onSecondaryContainer: palette.onSecondaryContainer,

    tertiary: palette.tertiary,
    onTertiary: palette.onPrimary,
    tertiaryContainer: palette.tertiaryContainer,
    onTertiaryContainer: palette.onTertiaryContainer,

    background: palette.background,
    onBackground: palette.ink,
    surface: palette.surface,
    onSurface: palette.ink,
    surfaceVariant: palette.surfaceVariant,
    onSurfaceVariant: palette.inkSoft,

    outline: palette.outline,
    outlineVariant: palette.line,
    error: palette.danger,
    elevation: {
      level0: 'transparent',
      level1: palette.surfaceContainerLow,
      level2: palette.surfaceVariant,
      level3: palette.primaryContainer,
      level4: palette.primaryContainer,
      level5: palette.primaryContainer,
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.primaryDark,
    onPrimary: '#1A0A4A',
    primaryContainer: palette.primaryContainerDark,
    onPrimaryContainer: palette.onPrimaryContainerDark,

    secondary: palette.secondaryDark,
    onSecondary: '#3D1F00',
    secondaryContainer: palette.secondaryContainerDark,
    onSecondaryContainer: palette.onSecondaryContainerDark,

    tertiary: palette.tertiaryDark,
    onTertiary: '#0B2615',
    tertiaryContainer: palette.tertiaryContainerDark,
    onTertiaryContainer: palette.onTertiaryContainerDark,

    background: palette.backgroundDark,
    onBackground: palette.inkInverse,
    surface: palette.surfaceDark,
    onSurface: palette.inkInverse,
    surfaceVariant: palette.surfaceVariantDark,
    onSurfaceVariant: palette.inkSoftDark,

    outline: palette.outlineDark,
    outlineVariant: palette.lineDark,
    error: '#F08989',
    elevation: {
      level0: 'transparent',
      level1: palette.surfaceContainerLowDark,
      level2: palette.surfaceVariantDark,
      level3: palette.primaryContainerDark,
      level4: palette.primaryContainerDark,
      level5: palette.primaryContainerDark,
    },
  },
};
