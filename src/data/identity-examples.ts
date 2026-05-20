import type { SupportedLocale } from '@/i18n';

export const identityExamples: string[] = [
  'sog‘lom inson',
  'intizomli inson',
  'bilimli inson',
  'sabrli inson',
  'mehribon inson',
  'diqqatini jamlay oladigan inson',
  'jismonan kuchli inson',
  'ruhan xotirjam inson',
  'doimiy rivojlanadigan inson',
  'mas’uliyatli inson',
  'minnatdor inson',
  'ijodkor inson',
];

export const identityExamplesByLanguage: Record<SupportedLocale, string[]> = {
  uz: identityExamples,
  en: [
    'a healthy person',
    'a disciplined person',
    'a knowledgeable person',
    'a patient person',
    'a kind person',
    'a focused person',
    'a physically strong person',
    'a calm person',
    'a person who keeps growing',
    'a responsible person',
    'a grateful person',
    'a creative person',
  ],
};

export const emojiOptions: string[] = [
  '💧', '📖', '🏃', '🧘', '🤲', '📔', '🌱', '🚫', '🥗', '✍️',
  '🙏', '🚶', '💪', '🎯', '⏰', '🌅', '🌙', '🔥', '⭐', '🌿',
  '☀️', '🍎', '📚', '✨', '🎵', '🧠', '❤️', '🕯️', '🌸', '🦋',
];
