import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from './locales/uz.json';

export const defaultLocale = 'uz';

void i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
