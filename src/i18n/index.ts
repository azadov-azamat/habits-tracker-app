import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uz from './locales/uz.json';

export const defaultLocale = 'uz';
export const supportedLocales = ['uz', 'en'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

void i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    en: { translation: en },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  compatibilityJSON: 'v3',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
