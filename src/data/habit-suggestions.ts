import type { SupportedLocale } from '@/i18n';

export type HabitSuggestion = {
  emoji: string;
  name: string;
  identity: string;
  whyExample: string;
  minimalExample: string;
};

export const habitSuggestions: HabitSuggestion[] = [
  {
    emoji: '💧',
    name: 'Har kuni 8 stakan suv ichish',
    identity: 'sog‘lom inson',
    whyExample: 'Sog‘lig‘im va energiyam uchun',
    minimalExample: 'Hech bo‘lmasa 1 stakan suv ichish',
  },
  {
    emoji: '📖',
    name: 'Har kuni 10 daqiqa o‘qish',
    identity: 'bilimli inson',
    whyExample: 'Aqlimni boyitish va dunyoqarashimni kengaytirish uchun',
    minimalExample: '1 sahifa o‘qish',
  },
  {
    emoji: '🏃',
    name: 'Har kuni 15 daqiqa harakat',
    identity: 'jismoniy faol inson',
    whyExample: 'Tanam quvvatli va kayfiyatim baland bo‘lishi uchun',
    minimalExample: '5 marta o‘tirib-turish yoki 2 daqiqa yurish',
  },
  {
    emoji: '🧘',
    name: '5 daqiqa meditatsiya',
    identity: 'xotirjam va ongli inson',
    whyExample: 'Stressni kamaytirish va diqqatimni jamlash uchun',
    minimalExample: '1 daqiqa chuqur nafas olish',
  },
  {
    emoji: '🤲',
    name: 'Kuniga 5 vaqt namoz',
    identity: 'diniy intizomli inson',
    whyExample: 'Ruhiy poklik va Allohga yaqinlik uchun',
    minimalExample: 'Bir vaqt namozni o‘z vaqtida o‘qish',
  },
  {
    emoji: '📔',
    name: 'Kunlik daftar yozish',
    identity: 'ongli yashaydigan inson',
    whyExample: 'Fikrlarimni tartibga solish va o‘zimni yaxshiroq tushunish uchun',
    minimalExample: '1 jumla yozish',
  },
  {
    emoji: '🌱',
    name: '8 soat uxlash',
    identity: 'sog‘lom va yaxshi dam oladigan inson',
    whyExample: 'Ertaga energiyali bo‘lib uyg‘onish uchun',
    minimalExample: '23:00 da yotishni boshlash',
  },
  {
    emoji: '🚫',
    name: 'Telefonsiz 1 soat',
    identity: 'diqqatini jamlay oladigan inson',
    whyExample: 'Bo‘sh vaqtimni qaytarib olish va hayotga ko‘proq e’tibor berish uchun',
    minimalExample: 'Telefonni 15 daqiqa boshqa xonaga qo‘yish',
  },
  {
    emoji: '🥗',
    name: 'Sog‘lom ovqatlanish',
    identity: 'jismonan sog‘lom inson',
    whyExample: 'Tanamga foydali quvvat berish uchun',
    minimalExample: 'Bitta meva yeyish',
  },
  {
    emoji: '✍️',
    name: 'Yangi til o‘rganish',
    identity: 'doimiy rivojlanadigan inson',
    whyExample: 'Yangi imkoniyatlar va kengroq dunyoqarash uchun',
    minimalExample: '5 ta yangi so‘z yodlash',
  },
  {
    emoji: '🙏',
    name: 'Minnatdorchilik bildirish',
    identity: 'baxtli va minnatdor inson',
    whyExample: 'Hayotning yaxshi tomonlariga e’tibor berish uchun',
    minimalExample: 'Minnatdor bo‘lgan 1 narsani yozish',
  },
  {
    emoji: '🚶',
    name: '10 000 qadam',
    identity: 'faol va sog‘lom inson',
    whyExample: 'Yuragim va miyam yaxshi ishlashi uchun',
    minimalExample: '10 daqiqa yurish',
  },
];

export const habitSuggestionsByLanguage: Record<SupportedLocale, HabitSuggestion[]> = {
  uz: habitSuggestions,
  en: [
    {
      emoji: '💧',
      name: 'Drink 8 glasses of water every day',
      identity: 'a healthy person',
      whyExample: 'For my health and energy',
      minimalExample: 'Drink at least 1 glass of water',
    },
    {
      emoji: '📖',
      name: 'Read for 10 minutes every day',
      identity: 'a knowledgeable person',
      whyExample: 'To enrich my mind and broaden my view of the world',
      minimalExample: 'Read 1 page',
    },
    {
      emoji: '🏃',
      name: 'Move for 15 minutes every day',
      identity: 'an active person',
      whyExample: 'So my body feels strong and my mood stays high',
      minimalExample: 'Do 5 squats or walk for 2 minutes',
    },
    {
      emoji: '🧘',
      name: 'Meditate for 5 minutes',
      identity: 'a calm and mindful person',
      whyExample: 'To reduce stress and focus my attention',
      minimalExample: 'Take 1 minute of deep breaths',
    },
    {
      emoji: '🤲',
      name: 'Pray on time',
      identity: 'a spiritually disciplined person',
      whyExample: 'For spiritual clarity and closeness to Allah',
      minimalExample: 'Pray one prayer on time',
    },
    {
      emoji: '📔',
      name: 'Write a daily journal',
      identity: 'a mindful person',
      whyExample: 'To organize my thoughts and understand myself better',
      minimalExample: 'Write 1 sentence',
    },
    {
      emoji: '🌱',
      name: 'Sleep 8 hours',
      identity: 'a well-rested and healthy person',
      whyExample: 'So I wake up with energy tomorrow',
      minimalExample: 'Start getting ready for bed at 11:00 PM',
    },
    {
      emoji: '🚫',
      name: 'Spend 1 hour without my phone',
      identity: 'a focused person',
      whyExample: 'To reclaim my time and pay more attention to life',
      minimalExample: 'Put my phone in another room for 15 minutes',
    },
    {
      emoji: '🥗',
      name: 'Eat healthier',
      identity: 'a physically healthy person',
      whyExample: 'To give my body useful energy',
      minimalExample: 'Eat one piece of fruit',
    },
    {
      emoji: '✍️',
      name: 'Learn a new language',
      identity: 'a person who keeps growing',
      whyExample: 'For new opportunities and a broader worldview',
      minimalExample: 'Learn 5 new words',
    },
    {
      emoji: '🙏',
      name: 'Practice gratitude',
      identity: 'a grateful person',
      whyExample: 'To notice the good things in life',
      minimalExample: 'Write down 1 thing I am grateful for',
    },
    {
      emoji: '🚶',
      name: 'Walk 10,000 steps',
      identity: 'an active and healthy person',
      whyExample: 'For my heart and mind to work well',
      minimalExample: 'Walk for 10 minutes',
    },
  ],
};
