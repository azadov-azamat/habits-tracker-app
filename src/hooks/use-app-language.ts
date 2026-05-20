import { useEffect } from 'react';
import i18n from '@/i18n';
import { useSettingsStore } from '@/store/settings-store';

export function useAppLanguage() {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
}
