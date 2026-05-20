import type { SupportedLocale } from '@/i18n';

export type Quote = {
  text: string;
  textEn: string;
  author?: string;
  sourceTitle: string;
  sourceUrl: string;
};

export const quotes: Quote[] = [
  {
    text: 'Odatlar o‘zini yaxshilashning murakkab foizi kabi ishlaydi.',
    textEn: 'Habits are the compound interest of self-improvement.',
    author: 'James Clear',
    sourceTitle: 'Atomic Habits Quotes',
    sourceUrl: 'https://jamesclear.com/quote/atomic-habits',
  },
  {
    text: 'Maqsad yo‘nalishni belgilaydi, tizim esa oldinga siljitadi.',
    textEn: 'Goals set the direction, but systems move you forward.',
    author: 'James Clear',
    sourceTitle: 'Atomic Habits Quotes',
    sourceUrl: 'https://jamesclear.com/quote/atomic-habits',
  },
  {
    text: 'Sen maqsadlaring darajasiga ko‘tarilmaysan, tizimlaring darajasiga qaytasan.',
    textEn: 'You do not rise to the level of your goals; you fall to the level of your systems.',
    author: 'James Clear',
    sourceTitle: 'Atomic Habits Quotes',
    sourceUrl: 'https://jamesclear.com/quote/atomic-habits',
  },
  {
    text: 'Har bir harakating kim bo‘lishni xohlayotganing uchun berilgan bir ovozdir.',
    textEn: 'Every action you take is a vote for the type of person you wish to become.',
    author: 'James Clear',
    sourceTitle: 'How to Change Your Beliefs and Stick to Your Goals for Good',
    sourceUrl: 'https://jamesclear.com/identity-votes',
  },
  {
    text: 'Har bir katta ish kichik boshlanishdan paydo bo‘ladi.',
    textEn: 'Every great thing comes from a small beginning.',
    author: 'James Clear',
    sourceTitle: 'Atomic Habits Quotes',
    sourceUrl: 'https://jamesclear.com/quote/atomic-habits',
  },
  {
    text: 'Bir marta o‘tkazib yuborish tasodif; ikki marta o‘tkazib yuborish esa yangi odatning boshlanishidir.',
    textEn: 'Missing once is an accident; missing twice is the start of a new habit.',
    author: 'James Clear',
    sourceTitle: 'Atomic Habits Quotes',
    sourceUrl: 'https://jamesclear.com/quote/atomic-habits',
  },
  {
    text: 'Nimani odatga aylantirmoqchi bo‘lsang, uni amalda bajar.',
    textEn: 'If you want to make something a habit, practice it.',
    author: 'Epiktet',
    sourceTitle: 'A Selection from the Discourses of Epictetus',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/10661/pg10661-images.html',
  },
  {
    text: 'Nimani odatga aylantirmoqchi bo‘lmasang, uni qilma; o‘rniga boshqa ishga o‘rgan.',
    textEn: 'If you do not want something to become a habit, do not do it; practice something else instead.',
    author: 'Epiktet',
    sourceTitle: 'A Selection from the Discourses of Epictetus',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/10661/pg10661-images.html',
  },
  {
    text: 'Avval qanday inson bo‘lishingni aniqla, so‘ng shunga mos ishlarni qil.',
    textEn: 'First decide what kind of person you want to be, then do what such a person does.',
    author: 'Epiktet',
    sourceTitle: 'The Enchiridion',
    sourceUrl: 'https://www.gutenberg.org/files/45109/45109-h/45109-h.htm',
  },
  {
    text: 'Baxtli hayot fazilatli hayotdir; fazilatli hayot esa mehnat talab qiladi.',
    textEn: 'A happy life is a virtuous life, and a virtuous life requires effort.',
    author: 'Aristotel',
    sourceTitle: 'The Nicomachean Ethics',
    sourceUrl: 'https://www.gutenberg.org/files/8438/8438-h/8438-h',
  },
  {
    text: 'Bitta qaldirg‘och bahor keltirmaydi; bir kun ham insonni baxtli qilib qo‘ymaydi.',
    textEn: 'One swallow does not make a spring, and one day does not make a person happy.',
    author: 'Aristotel',
    sourceTitle: 'The Nicomachean Ethics',
    sourceUrl: 'https://www.gutenberg.org/files/8438/8438-h/8438-h',
  },
  {
    text: 'Yaxshi inson qanday bo‘lishi haqida tortishishni bas qil; shunday inson bo‘l.',
    textEn: 'Stop arguing about what a good person should be; be one.',
    author: 'Mark Avreliy',
    sourceTitle: 'Meditations',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/2680/pg2680-images.html',
  },
  {
    text: 'To‘g‘ri bo‘lmasa, qilma; rost bo‘lmasa, aytma.',
    textEn: 'If it is not right, do not do it; if it is not true, do not say it.',
    author: 'Mark Avreliy',
    sourceTitle: 'Meditations',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/2680/pg2680-images.html',
  },
  {
    text: 'Tashqi hodisalarga emas, o‘z fikrlaringga hukmron bo‘l.',
    textEn: 'Rule your thoughts, not external events.',
    author: 'Mark Avreliy',
    sourceTitle: 'Meditations',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/2680/pg2680-images.html',
  },
  {
    text: 'Bugungi vazifang — inson sifatida o‘z ishingni bajarish.',
    textEn: 'Your task today is to do your work as a human being.',
    author: 'Mark Avreliy',
    sourceTitle: 'Meditations',
    sourceUrl: 'https://www.gutenberg.org/cache/epub/2680/pg2680-images.html',
  },
  {
    text: 'Ming chaqirimlik yo‘l ham oyoq ostidan boshlanadi.',
    textEn: 'A journey of a thousand miles begins beneath your feet.',
    author: 'Laozi',
    sourceTitle: 'Tao Te Ching, chapter 64',
    sourceUrl: 'https://taoism.net/tao-te-ching-chapter-64/',
  },
  {
    text: 'Qiyin ish osonligida, katta ish esa kichikligida boshlanadi.',
    textEn: 'Difficult things begin while they are easy; great things begin while they are small.',
    author: 'Laozi',
    sourceTitle: 'Tao Te Ching, chapter 63',
    sourceUrl: 'https://en.wikisource.org/wiki/Tao_Te_Ching',
  },
  {
    text: 'Bugungi ishni ertaga qoldirmasdan, hozir bajarish yaxshiroq.',
    textEn: 'It is better to do today’s work now than leave it for tomorrow.',
    author: 'Benjamin Franklin',
    sourceTitle: 'Advice to a Young Tradesman',
    sourceUrl: 'https://founders.archives.gov/documents/Franklin/01-03-02-0130',
  },
  {
    text: 'Yo‘qotilgan vaqt qayta topilmaydi.',
    textEn: 'Lost time is never found again.',
    author: 'Benjamin Franklin',
    sourceTitle: 'Poor Richard Improved, 1748',
    sourceUrl: 'https://franklinpapers.org/framedVolumes.jsp?vol=3&page=306a',
  },
  {
    text: 'O‘qishga arziydigan narsa yoz yoki yozishga arziydigan ish qil.',
    textEn: 'Either write something worth reading or do something worth writing.',
    author: 'Benjamin Franklin',
    sourceTitle: 'Poor Richard Improved, 1738',
    sourceUrl: 'https://franklinpapers.org/framedVolumes.jsp?vol=2&page=265a',
  },
  {
    text: 'Bugungi kunni yakunla va ortda qoldir; qo‘lingdan kelganini qilding.',
    textEn: 'Finish each day and be done with it; you have done what you could.',
    author: 'Ralph Waldo Emerson',
    sourceTitle: 'Letter to Ellen Emerson',
    sourceUrl: 'https://practopian.org/quotes/finish-every-day-and-be-done-with-it.html',
  },
  {
    text: 'Kim bo‘lishni orzu qilgan bo‘lsang, shunday inson bo‘la boshlashing kerak.',
    textEn: 'The only person you are destined to become is the person you decide to be.',
    author: 'Ralph Waldo Emerson',
    sourceTitle: 'Nature',
    sourceUrl: 'https://www.gutenberg.org/files/29433/29433-h/29433-h.htm',
  },
  {
    text: 'Orzularing tomon ishonch bilan yur va tasavvur qilgan hayotingni yashashga intil.',
    textEn: 'Go confidently in the direction of your dreams and live the life you have imagined.',
    author: 'Henry David Thoreau',
    sourceTitle: 'Walden',
    sourceUrl: 'https://www.gutenberg.org/files/205/205-h/205-h.htm',
  },
  {
    text: 'Oddiylashtir, oddiylashtir.',
    textEn: 'Simplify, simplify.',
    author: 'Henry David Thoreau',
    sourceTitle: 'Walden',
    sourceUrl: 'https://www.gutenberg.org/files/205/205-h/205-h.htm',
  },
  {
    text: 'Harakat har doim ham baxt keltirmaydi, lekin harakatsiz baxt yo‘q.',
    textEn: 'Action may not always bring happiness, but there is no happiness without action.',
    author: 'William James',
    sourceTitle: 'The Principles of Psychology',
    sourceUrl: 'https://www.gutenberg.org/files/57628/57628-h/57628-h.htm',
  },
  {
    text: 'Hayotdagi buyuk ishlar bir lahzada emas, ko‘plab kichik urinishlar orqali quriladi.',
    textEn: 'Great things are not done in a moment, but by many small efforts.',
    author: 'Vincent van Gogh',
    sourceTitle: 'The Letters of Vincent van Gogh',
    sourceUrl: 'https://www.vangoghletters.org/vg/letters/let274/letter.html',
  },
  {
    text: 'Yaxshi bajarilgan ishning mukofoti — uni bajargan bo‘lishning o‘zi.',
    textEn: 'The reward of a thing well done is having done it.',
    author: 'Ralph Waldo Emerson',
    sourceTitle: 'Essays: Second Series',
    sourceUrl: 'https://www.gutenberg.org/files/2945/2945-h/2945-h.htm',
  },
  {
    text: 'Agar oldinga ucholmasang, yugur; yugura olmasang, yur; yura olmasang, sudral, lekin oldinga intil.',
    textEn: 'If you cannot fly, run; if you cannot run, walk; if you cannot walk, crawl, but keep moving forward.',
    author: 'Martin Luther King Jr.',
    sourceTitle: 'Keep Moving from This Mountain',
    sourceUrl: 'https://kinginstitute.stanford.edu/king-papers/documents/keep-moving-mountain-address-spelman-college',
  },
  {
    text: 'Muvaffaqiyat egallagan mavqeing bilan emas, yengib o‘tgan to‘siqlaring bilan o‘lchanadi.',
    textEn: 'Success is measured not by the position you reach, but by the obstacles you overcome.',
    author: 'Booker T. Washington',
    sourceTitle: 'Up from Slavery',
    sourceUrl: 'https://www.gutenberg.org/files/2376/2376-h/2376-h.htm',
  },
  {
    text: 'Eng yaxshisi ba’zan yaxshining dushmaniga aylanadi.',
    textEn: 'The best can become the enemy of the good.',
    author: 'Volter',
    sourceTitle: 'La Bégueule',
    sourceUrl: 'https://en.wikiquote.org/wiki/Voltaire',
  },
];

export function pickQuoteForDay(dateKey: string, locale: SupportedLocale = 'uz'): Quote {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const quote = quotes[hash % quotes.length]!;
  return locale === 'en' ? { ...quote, text: quote.textEn } : quote;
}
