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
