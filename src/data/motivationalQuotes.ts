export type Quote = {
  text: string;
  author?: string;
};

export const quotes: Quote[] = [
  { text: 'Suvni tomchi-tomchi tomadi — toshni teshadi.', author: 'Xalq maqoli' },
  { text: 'Kim mehnat qilsa, u rohatga erishadi.', author: 'Alisher Navoiy' },
  { text: 'Bilim — yorug‘lik, johillik — qorong‘ilik.', author: 'Xalq maqoli' },
  { text: 'Sabr — saodat kaliti.', author: 'Xalq maqoli' },
  { text: 'Bugungi ish — ertaning poydevoridir.', author: 'Furqat' },
  { text: 'Niyat qilgan — yarim ishni qilgan.', author: 'Xalq maqoli' },
  { text: 'Daraxt mevasidan, inson mehnatidan tanilur.', author: 'Xalq maqoli' },
  { text: 'Yo‘l yurgan kishi yetishadi.', author: 'Xalq maqoli' },
  { text: 'Kichik qadam — uzoq yo‘lning boshlanishidir.', author: 'Lao Tzi' },
  { text: 'Sen kim ekanligingni qilayotgan ishlaring ko‘rsatadi.', author: 'Aristotel' },
  { text: 'Mukammallik amal emas — odatdir.', author: 'Aristotel' },
  { text: 'Bir kun mehnat — bir umrlik tinch.', author: 'Xalq maqoli' },
  { text: 'Kim o‘zini yengsa — eng katta jangda g‘olibdir.', author: 'Hadis' },
  { text: 'Kichik o‘zgarish — katta natija.', author: 'James Clear' },
  { text: 'Odatlar — taqdir muhandislari.', author: 'James Clear' },
  { text: 'Sen bugun ekkan urug‘ — ertangi xirmoning.', author: 'Xalq donoligi' },
  { text: 'Tomchi yig‘ilib daryo bo‘lur.', author: 'Xalq maqoli' },
  { text: 'Yaxshi odat — eng ishonchli do‘st.', author: 'Aflotun' },
  { text: 'Bir kunning g‘alabasi — bir umrlik sayohatning bir qadami.', author: 'Anonim' },
  { text: 'Bilim — mol-mulkdan ustun.', author: 'Hadis' },
  { text: 'Boshlash — yarim yo‘ldir.', author: 'Yunon maqoli' },
  { text: 'Eng tez yo‘l — to‘g‘ri yo‘l.', author: 'Xalq donoligi' },
  { text: 'Kim izlasa, topadi.', author: 'Xalq maqoli' },
  { text: 'Sabrli odamning g‘olibligi muqarrar.', author: 'Sa’diy' },
  { text: 'Bir lahza sabr — bir umr huzur.', author: 'Xalq maqoli' },
  { text: 'Mehnatsiz hosil yo‘q.', author: 'Xalq maqoli' },
  { text: 'Har bir kun — yangi imkoniyat.', author: 'Anonim' },
  { text: 'Quvvat — takrordadir.', author: 'Bruce Lee' },
  { text: 'Bugun qiyin — ertaga oson, indinga go‘zal.', author: 'Jack Ma' },
  { text: 'Eng katta to‘siq — o‘zingsan, eng katta ittifoqchi ham — o‘zingsan.', author: 'Anonim' },
  { text: 'Yaxshilik kichik bo‘lmaydi — har bir yaxshilik buyukdir.', author: 'Hadis' },
  { text: 'Yo‘lda yiqilgan — to‘xtagan emas.', author: 'Xalq donoligi' },
  { text: 'Bir nima qilolmasang — qilolganingni qila ber.', author: 'Konfutsiy' },
  { text: 'Insonni o‘rganishi — o‘zini bilishidan boshlanadi.', author: 'Sokrat' },
  { text: 'Sen e’tibor bergan narsa — o‘sadi.', author: 'Anonim' },
  { text: 'Doimiylik — iqtidordan ko‘ra muhimroq.', author: 'Anonim' },
  { text: 'Yashash — o‘rganish demakdir.', author: 'Aflotun' },
  { text: 'Har kuni kichik yutuq — yiliga buyuk g‘alaba.', author: 'Anonim' },
  { text: 'Odat — taqdiringga aylanmasdan oldin — tanlovingdir.', author: 'Anonim' },
  { text: 'Ko‘zingni maqsadda, oyog‘ingni bugungi qadamda tut.', author: 'Anonim' },
  { text: 'Daraxtni 20 yil oldin ekish kerak edi. Ikkinchi yaxshi vaqt — bugun.', author: 'Xitoy maqoli' },
  { text: 'Birovni o‘zgartirish qiyin, lekin o‘zingni o‘zgartirish — sening qo‘lingda.', author: 'Tolstoy' },
  { text: 'Sen yiqilganing uchun emas — turolmaganing uchun mag‘lub bo‘lasan.', author: 'Anonim' },
  { text: 'Mehnatning shirini — natijasi.', author: 'Xalq maqoli' },
  { text: 'Vaqtni qadrla — u qaytmaydi.', author: 'Xalq maqoli' },
  { text: 'Yetgan joying — boshlangan joying yutug‘i.', author: 'Anonim' },
  { text: 'Tinch suv — chuqur suv.', author: 'Xalq maqoli' },
  { text: 'Aql olmos — sayqal mehnat.', author: 'Xalq maqoli' },
  { text: 'Ishonch — ish ostida tug‘iladi.', author: 'Anonim' },
  { text: 'Sen — sen yarim yo‘lda qoldirgan o‘zinging emassan. Sen — bugun davom etayotgan o‘zingsan.', author: 'Anonim' },
];

export function pickQuoteForDay(dateKey: string): Quote {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return quotes[hash % quotes.length]!;
}
