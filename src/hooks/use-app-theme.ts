import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settings-store';
import { darkTheme, lightTheme } from '@/theme/paper-theme';

export function useAppTheme() {
  const themeMode = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  const resolved =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
  return resolved === 'dark' ? darkTheme : lightTheme;
}
