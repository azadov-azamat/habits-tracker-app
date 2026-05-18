# 40 Kun — Chilla Habit Tracker

40 kunlik chilla davrida bitta asosiy odat va 2 ta mikro odat shakllantirishga yordam beruvchi React Native ilovasi. To‘liq **oflayn** ishlaydi, o‘zbek tilida va inson psixologiyasi (Atomic Habits, identity-based change, gentle recovery) tamoyillariga asoslangan.

## Texnologiyalar

- **Expo SDK 52** (managed) + TypeScript
- **expo-router** — file-based navigation
- **react-native-paper** — Material 3 UI
- **zustand** + AsyncStorage — lokal saqlash
- **expo-notifications** — eslatma va snooze
- **react-native-reanimated** — animatsiyalar
- **i18next** — o‘zbek lokalizatsiyasi
- **date-fns** — sana boshqaruvi

## Boshlash

```bash
npm install
npx expo start
```

Telefonda Expo Go orqali QR kodni o‘qib oching (yoki simulyatorda `i`/`a` bosing).

> **Eslatma:** Notification action buttons (`Bajardim` / `Keyinroq`) to‘liq ishlashi uchun dev build kerak bo‘lishi mumkin: `npx expo install eas-cli && eas build --profile development`.

## Struktura

```
app/                          expo-router screens
  (onboarding)/               7 ta sozlash bosqichi
  (tabs)/                     bugun · yo‘l xaritasi · sozlamalar
  habit/[id].tsx              odat tafsiloti
  habit/new.tsx               mikro odat qo‘shish
src/
  components/                 UI primitivlari (FortyDayGrid, CheckInButton, ...)
  store/                      zustand stores (habits, settings, onboarding)
  services/                   notifications, streak, milestone
  i18n/locales/uz.json        barcha matnlar (yagona joy)
  data/                       iqtiboslar, odat takliflari, identitetlar
  theme/                      Material 3 light/dark palette
  utils/                      sana, haptic helpers
```

## Eslatma logikasi

1. Odat yaratilganda kunlik takrorlanuvchi eslatma jadval qilinadi (`hour`/`minute`/`repeats: true`).
2. Eslatma kelganda 2 ta action button: **Bajardim** / **Keyinroq**.
3. "Bajardim" → app ochilmasdan check-in qiladi va kunduzgi pending snoozelarni bekor qiladi.
4. "Keyinroq" yoki javobsiz → har `snoozeIntervalMin` daqiqada `maxSnoozes` martagacha qayta eslatadi.

## Psixologik xususiyatlar

- 40-kunlik chilla grid (5×8) — markaziy visual
- Identity-based framing: "Men ___ bo‘lib boraman"
- Implementation intention: "Agar X bo‘lsa, men Y qilaman"
- Eng oson ko‘rinish (2 daqiqalik qoida)
- O‘tkazib yuborilgan kun uchun do‘stona xabar (qizil X yo‘q)
- 2 kun ketma-ket o‘tkazganda yumshoq sozlash taklifi
- Har check-in’da haptic + animatsiya
- 1, 7, 14, 21, 30, 40 kunlarda alohida tabriklar
- Har kuni yangi o‘zbekcha iqtibos
- Bir vaqtda faqat 1 asosiy odat (3x success rate)

## Skriptlar

```bash
npm start            # expo start
npm run android      # Android’da ishga tushirish
npm run ios          # iOS’da ishga tushirish
npm run typecheck    # TypeScript tekshirish
```
