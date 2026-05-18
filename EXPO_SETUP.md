# Expo'ga Ulanish Qo'llanmasi

Bu qo'llanma loyihani sizning Expo akkountingizga ulashning to'liq jarayonini ko'rsatadi.

## 1. Tayyorgarlik

`eas-cli` allaqachon `node_modules` ichida o'rnatilgan. `app.json` va `eas.json` tayyor — faqat sizning ma'lumotlaringiz bilan to'ldirish kerak.

## 2. Expo akkountga kirish

```bash
npx eas login
```

Brauzer ochiladi. Mavjud akkountingiz bilan kiring.

Tasdiqlash:
```bash
npx eas whoami
```

## 3. App'ni Expo'ga "init" qilish

```bash
npx eas init
```

Bu komanda:
- `app.json` ichidagi `extra.eas.projectId` ni avtomatik to'ldiradi
- Expo dashboard'da (expo.dev) loyiha yaratadi
- `slug` va `owner`ni ulaydi

Agar `owner` so'ralsa, sizning Expo username'ingizni tanlang (yoki organization).

> **Eslatma:** Agar slug band bo'lsa, `app.json` ichida `"slug": "habits-tracker-app"` ni o'zgartiring (masalan, `"qirqkun-app"`).

## 4. `runtimeVersion` va `updates.url` ni yangilash

`eas init` `extra.eas.projectId` ni o'zgartiradi. `updates.url` ni qo'lda yangilang:

```jsonc
// app.json
"updates": {
  "url": "https://u.expo.dev/<sizning-project-id>"
}
```

Project ID ni `expo.dev` dashboard'dan yoki `npx eas project:info` orqali olishingiz mumkin.

## 5. Birinchi Dev Build (notification action buttons uchun)

Expo Go bilan notification action buttonlari ishlamaydi. To'liq sinab ko'rish uchun development build kerak:

```bash
npx eas build --profile development --platform android
# yoki iOS uchun:
npx eas build --profile development --platform ios
```

Build tugagach, QR kod orqali APK/IPA o'rnating. Keyin:

```bash
npx expo start --dev-client
```

## 6. Internal Preview Build (boshqalar ham sinashi uchun)

```bash
npm run build:android
# yoki
npm run build:ios
```

Build tayyor bo'lgach, Expo dashboard'dan share link olib, do'stlaringizga yuborishingiz mumkin.

## 7. Production Build (do'konga chiqarish)

```bash
npm run build:prod
```

So'ngra:
```bash
npx eas submit --platform android  # Google Play uchun
npx eas submit --platform ios       # App Store uchun
```

## 8. OTA (Over-the-Air) Update

Native kodga tegmagan o'zgarishlar (UI, logika, matn) uchun, qayta build qilish shart emas:

```bash
npm run update
```

Foydalanuvchilar app'ni keyingi marta ochganda yangilanishni avtomatik oladi.

## 9. Web Preview (expo.dev'da)

```bash
npx expo export --platform web
```

Yoki app'ni `expo.dev/snack` ga `git` orqali ulang.

## Yo'lakda muammolar bo'lsa

| Muammo | Yechim |
|---|---|
| `slug already taken` | `app.json` da slug'ni o'zgartiring |
| `owner permission` | `app.json` ga `"owner": "your_username"` qo'shing |
| Notification ishlamayapti | Development build kerak (Expo Go cheklovi) |
| iOS build credentials | `npx eas credentials` orqali sertifikat yarating |

## Tezkor referans

```bash
npx eas login              # kirish
npx eas whoami             # kim sifatida kirgan
npx eas init               # loyihani ulash
npx eas project:info       # loyiha haqida
npm run build:android      # Android APK
npm run build:ios          # iOS IPA (TestFlight)
npm run update             # OTA update
```
