import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { darkTheme, lightTheme } from '@/theme/paperTheme';

export function useAppTheme() {
  const themeMode = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  const resolved =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
  return resolved === 'dark' ? darkTheme : lightTheme;
}
