# توثيق مشروع Safarni - منصة السفر والسياحة المتكاملة
# Safarni Project Documentation - Travel System Marketplace

---

## 1. وصف المشروع العام (Project Overview)

**Safarni** هي منصة سفر وسياحة متكاملة وحديثة مبنية باستخدام **Next.js 16** مع **TypeScript** و **React 19** وقاعدة بيانات **PostgreSQL** (عبر Prisma ORM). يوفر النظام حلاً شاملاً لحجز الرحلات الجوية والفنادق والجولات السياحية واستئجار السيارات.

**Safarni** is a modern, integrated travel and tourism platform built using **Next.js 16** with **TypeScript**, **React 19**, and **PostgreSQL** database (via Prisma ORM). The system provides a comprehensive solution for booking flights, hotels, tours, and car rentals.

### المستخدمون المستهدفون (Target Users):
* **الزائر (Guest)**: يستطيع البحث والتصفح والاطلاع على العروض دون الحاجة للتسجيل
* **المستخدم (User)**: يستطيع التسجيل، تسجيل الدخول، والقيام بعمليات الحجز المختلفة
* **المدير (Admin)**: إدارة كاملة للنظام (إضافة وتعديل وحذف البيانات)
* **المشتري (Buyer)**: عملية الدفع والحجز والإدارة

### الميزات الأساسية (Key Features):
- 🔐 مصادقة آمنة باستخدام NextAuth مع دعم Google OAuth و Credentials
- ✈️ حجز الرحلات الجوية (Flights)
- 🏨 حجز الفنادق (Hotels)
- 🎫 حجز الجولات السياحية (Tours)
- 🚗 استئجار السيارات (Car Rentals)
- 💳 الدفع المرن باستخدام Stripe
- 📱 واجهة مستخدم حديثة وسريعة
- 🔔 تنبيهات فورية باستخدام react-hot-toast

---

## 2. موديولات المشروع (Project Modules)

المشروع مقسم إلى موديولات منظمة داخل مجلد `src/` وتتبع معمارية Next.js:

### 1. موديول المصادقة والهوية (`/src/app/api/auth`)
**الوظيفة (Purpose)**: إدارة عمليات المستخدمين المتعلقة بالهوية والمصادقة

* التسجيل (Sign Up)
* تسجيل الدخول (Sign In)
* تحقق من البريد الإلكتروني
* إعادة تعيين كلمة المرور
* إدارة الجلسات (Sessions)

**الملفات الأساسية (Key Files)**:
- [src/lib/auth.ts](src/lib/auth.ts) - إعدادات NextAuth
- [src/lib/db.ts](src/lib/db.ts) - اتصال قاعدة البيانات
- [src/app/api/auth/[...nextauth]/route.ts](src/app/api/auth/[...nextauth]/route.ts) - Route Handler لـ NextAuth
- [src/app/api/auth/register/route.ts](src/app/api/auth/register/route.ts) - API للتسجيل

### 2. موديول الحجوزات (`/src/app/api/bookings`)
**الوظيفة**: إدارة جميع عمليات الحجز وربط الخدمات ببعضها

* إنشاء حجز جديد
* استرجاع حجوزات المستخدم
* تحديث حالة الحجز
* حساب السعر الإجمالي
* معالجة الدفع والتأكيد

**الملفات الأساسية**:
- [src/app/api/bookings/route.ts](src/app/api/bookings/route.ts) - API للحجوزات
- [src/app/api/bookings/[id]/route.ts](src/app/api/bookings/[id]/route.ts) - API لحجز محدد
- [src/store/bookingStore.ts](src/store/bookingStore.ts) - State Management للحجوزات

### 3. موديول الصفحات (Pages Module)

#### صفحة الرحلات الجوية (`/src/app/flights`)
- عرض قائمة الرحلات الجوية
- البحث والفلترة
- عرض تفاصيل الرحلة

#### صفحة الفنادق (`/src/app/hotels`)
- عرض الفنادق المتاحة
- البحث والفلترة حسب الموقع والتقييم والسعر
- عرض صور الفندق والتفاصيل

#### صفحة الجولات السياحية (`/src/app/tours`)
- عرض الجولات المتاحة
- البحث حسب الوجهة والمدة
- تفاصيل الجولة والصور

#### صفحة السيارات (`/src/app/cars`)
- عرض السيارات المتاحة
- فلترة حسب النوع والماركة والسعر
- معلومات السيارة والمميزات

#### صفحات المستخدم
- [src/app/login](src/app/login/page.tsx) - صفحة تسجيل الدخول
- [src/app/register](src/app/register/page.tsx) - صفحة التسجيل
- [src/app/dashboard](src/app/dashboard/page.tsx) - لوحة تحكم المستخدم
- [src/app/checkout](src/app/checkout/page.tsx) - صفحة الدفع والتأكيد

### 4. موديول المكونات (Components Module) - `src/components/`
**الكومبوننتات المشتركة (Shared Components)**:

| المكون | الوظيفة |
| :--- | :--- |
| **Navbar.tsx** | شريط التنقل العلوي مع روابط الملاحة وتسجيل الدخول |
| **SearchBar.tsx** | شريط البحث المتقدم لجميع الخدمات |
| **SessionProvider.tsx** | مزود الجلسات لـ NextAuth عبر Client-side |

### 5. موديول البيانات (`src/data/`)
**الوظيفة**: تخزين البيانات الوهمية (Mock Data) للتطوير والاختبار

- [src/data/mockData.ts](src/data/mockData.ts) - بيانات وهمية للرحلات والفنادق والجولات والسيارات

### 6. موديول الأنواع والتعريفات (`src/types/`)
**الوظيفة**: تعريف أنواع TypeScript المستخدمة في المشروع

- [src/types/index.ts](src/types/index.ts) - تعريف الواجهات (Interfaces) والأنواع (Types)

---

## 3. حزمة المكتبات المستخدمة (Packages / Dependencies)

تم اختيار المكتبات بعناية لتوفير أفضل الممارسات في الأداء والأمان والتطوير:

| اسم المكتبة | النسخة | ما هي؟ | لماذا استخدمناها؟ |
| :--- | :--- | :--- | :--- |
| **next** | 16.2.2 | إطار عمل React المتطور مع SSR و SSG | لبناء تطبيق ويب حديث وسريع مع دعم API Routes |
| **react** | 19.2.4 | مكتبة بناء الواجهات من Facebook | لبناء المكونات (Components) التفاعلية والديناميكية |
| **react-dom** | 19.2.4 | ربط مكتبة React بـ DOM | لتصيير مكونات React في المتصفح |
| **typescript** | ^5 | لغة برمجة مع نظام أنواع صارم (Static Typing) | لزيادة جودة الكود وتجنب الأخطاء البرمجية |
| **@prisma/client** | ^5.22.0 | ORM (Object-Relational Mapping) | لتسهيل التعامل مع قاعدة البيانات PostgreSQL |
| **prisma** | ^5.22.0 | أداة إدارة قاعدة البيانات | لإنشاء وإدارة migrations وأنماط البيانات (Schemas) |
| **next-auth** | ^5.0.0-beta.30 | مكتبة مصادقة لـ Next.js | لتوفير المصادقة الآمنة مع دعم OAuth و Credentials |
| **@auth/prisma-adapter** | ^2.11.1 | محول Prisma لـ NextAuth | لتخزين جلسات المستخدمين في Prisma |
| **bcryptjs** | ^3.0.3 | مكتبة لتشفير كلمات المرور | لتشفير وتحقق من كلمات المرور بشكل آمن |
| **stripe** | ^22.0.0 | مكتبة معالجة الدفع من جانب الخادم | لمعالجة عمليات الدفع والفواتير |
| **@stripe/stripe-js** | ^9.0.1 | مكتبة Stripe من جانب العميل | لإنشاء عناصر الدفع على الواجهة الأمامية |
| **zustand** | ^5.0.12 | مكتبة إدارة الحالة (State Management) | لإدارة حالة الحجوزات والتطبيق بشكل فعال وبسيط |
| **tailwindcss** | ^3.4.19 | إطار عمل CSS للتصميم المستجيب | لبناء واجهة مستخدم حديثة وجميلة بسهولة |
| **framer-motion** | ^12.38.0 | مكتبة للرسوميات والحركات | لإضافة رسوميات وانتقالات سلسة للتطبيق |
| **lucide-react** | ^1.7.0 | مكتبة الأيقونات | لاستخدام أيقونات احترافية وحديثة |
| **react-icons** | ^5.6.0 | مكتبة أيقونات بديلة | لتوفر مجموعات أيقونات متعددة |
| **react-hot-toast** | ^2.6.0 | مكتبة التنبيهات والإشعارات | لعرض تنبيهات فورية للمستخدم (نجاح، خطأ، معلومات) |
| **date-fns** | ^4.1.0 | مكتبة معالجة التواريخ | لمعالجة وتنسيق التواريخ بسهولة |
| **clsx** | ^2.1.1 | أداة دمج أسماء CSS classes | لدمج CSS classes بشكل ديناميكي وسهل |
| **tailwind-merge** | ^3.5.0 | دمج Tailwind CSS classes ذكياً | لحل تضاربات Tailwind CSS وتجنب التكرار |
| **@tailwindcss/postcss** | ^4 | معالج PostCSS لـ Tailwind | لمعالجة ملفات CSS مع Tailwind |
| **postcss** | ^8.5.8 | أداة معالجة CSS متقدمة | لتحويل CSS وإضافة Vendor Prefixes |
| **autoprefixer** | ^10.4.27 | إضافة CSS Prefixes تلقائياً | لضمان توافق CSS مع جميع المتصفحات |
| **eslint** | ^9 | أداة فحص جودة الكود | لفحص وتصحيح أخطاء الكود التلقائية |
| **nodemon** | ^5.0.0-beta.2 | أداة تطويرية | لإعادة تشغيل التطبيق تلقائياً عند التعديلات (في بيئة التطوير) |

---

## 4. نماذج البيانات (Data Models - Prisma Schema)

تم تعريف نماذج البيانات في ملف `prisma/schema.prisma`:

### Model: User (المستخدم)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  bookings  Booking[]
  profile   Profile?
}
```
**الحقول**:
- `id`: معرف فريد للمستخدم
- `name`: اسم المستخدم
- `email`: البريد الإلكتروني (فريد)
- `password`: كلمة المرور (مشفرة)
- `image`: صورة المستخدم
- `emailVerified`: تاريخ التحقق من البريد
- `createdAt`/`updatedAt`: تواريخ الإنشاء والتحديث

---

### Model: Profile (الملف الشخصي)
```prisma
model Profile {
  id          String  @id @default(cuid())
  userId      String  @unique
  phone       String?
  nationality String?
  passport    String?
  dateOfBirth String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
**الوظيفة**: تخزين بيانات إضافية للمستخدم

---

### Model: Booking (الحجز)
```prisma
model Booking {
  id          String        @id @default(cuid())
  userId      String
  type        BookingType
  status      BookingStatus @default(PENDING)
  totalPrice  Float
  currency    String        @default("USD")
  stripeId    String?
  details     Json
  passengers  Json?
  checkIn     DateTime?
  checkOut    DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([status])
}
```
**الحقول**:
- `type`: نوع الحجز (FLIGHT, HOTEL, TOUR, CAR)
- `status`: حالة الحجز (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `totalPrice`: السعر الإجمالي
- `details`: تفاصيل الحجز (JSON)
- `passengers`: بيانات الركاب (JSON)
- `checkIn`/`checkOut`: تواريخ الدخول والخروج

---

### Enums (التعريفات)

```typescript
enum BookingType {
  FLIGHT   // رحلة جوية
  HOTEL    // فندق
  TOUR     // جولة سياحية
  CAR      // سيارة
}

enum BookingStatus {
  PENDING     // معلق
  CONFIRMED   // مؤكد
  CANCELLED   // ملغى
  COMPLETED   // مكتمل
}
```

---

## 5. هيكلية المجلدات الرئيسية (Folder Structure)

```
Safarni/
├── src/
│   ├── app/                          # صفحات و API Routes (Next.js App Router)
│   │   ├── api/
│   │   │   ├── auth/                 # مسارات المصادقة
│   │   │   │   ├── [...nextauth]/    # NextAuth Route Handler
│   │   │   │   └── register/         # API التسجيل
│   │   │   └── bookings/             # API الحجوزات
│   │   ├── cars/                     # صفحة السيارات
│   │   ├── checkout/                 # صفحة الدفع والتأكيد
│   │   ├── dashboard/                # لوحة التحكم
│   │   ├── flights/                  # صفحة الرحلات الجوية
│   │   ├── hotels/                   # صفحة الفنادق
│   │   ├── login/                    # صفحة تسجيل الدخول
│   │   ├── register/                 # صفحة التسجيل
│   │   ├── tours/                    # صفحة الجولات السياحية
│   │   ├── globals.css               # أنماط CSS عامة
│   │   ├── layout.tsx                # تخطيط الصفحة الرئيسي
│   │   └── page.tsx                  # الصفحة الرئيسية
│   ├── components/                   # مكونات React المشتركة
│   │   ├── Navbar.tsx                # شريط التنقل
│   │   ├── SearchBar.tsx             # شريط البحث
│   │   └── SessionProvider.tsx       # مزود الجلسات
│   ├── data/
│   │   └── mockData.ts               # بيانات وهمية للتطوير
│   ├── lib/
│   │   ├── auth.ts                   # إعدادات NextAuth
│   │   ├── db.ts                     # إعدادات Prisma
│   │   └── utils.ts                  # دوال مساعدة
│   ├── store/
│   │   └── bookingStore.ts           # State Management (Zustand)
│   └── types/
│       └── index.ts                  # تعريفات TypeScript
├── prisma/
│   └── schema.prisma                 # نموذج قاعدة البيانات
├── public/                           # ملفات ثابتة (الصور، الأيقونات، إلخ)
├── package.json                      # تعريف المشروع والتبعيات
├── next.config.ts                    # إعدادات Next.js
├── tsconfig.json                     # إعدادات TypeScript
├── tailwind.config.ts                # إعدادات Tailwind CSS
├── postcss.config.js                 # إعدادات PostCSS
├── eslint.config.mjs                 # إعدادات ESLint
└── README.md                         # ملف التعليمات
```

---

## 6. عمليات سير العمل (Workflows)

### عملية البحث والحجز (Search & Booking Flow)

```
1. المستخدم يدخل صفحة الموقع ← يرى SearchBar
   ↓
2. يملأ بيانات البحث (المكان، التاريخ، إلخ) ← BookingStore يحفظ البيانات
   ↓
3. يختار نتيجة من النتائج ← يذهب لصفحة التفاصيل
   ↓
4. يضغط "احجز الآن" ← يذهب لصفحة Checkout
   ↓
5. يملأ بيانات الحجز والدفع ← Stripe يعالج الدفع
   ↓
6. تأكيد الحجز ← حفظ في قاعدة البيانات
   ↓
7. عرض تأكيد الحجز ← إرسال بريد تأكيد
```

### عملية التسجيل والدخول (Authentication Flow)

```
1. المستخدم يختار "تسجيل" أو "دخول"
   ↓
2. يملأ البيانات (البريد + كلمة المرور)
   ↓
3. NextAuth يتحقق من البيانات
   ↓
4. تشفير كلمة المرور باستخدام bcryptjs
   ↓
5. حفظ المستخدم في قاعدة البيانات (Prisma)
   ↓
6. إنشاء Session و Tokens
   ↓
7. إعادة التوجيه للصفحة الرئيسية أو Dashboard
```

---

## 7. متغيرات البيئة المطلوبة (.env.local)

```bash
# قاعدة البيانات
DATABASE_URL="postgresql://user:password@localhost:5432/safarni"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (للدفع)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

---

## 8. الأوامر الأساسية (Basic Commands)

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل المشروع في الإنتاج
npm start

# فحص جودة الكود
npm run lint

# إنشاء Prisma Client
npx prisma generate

# تشغيل Migrations
npx prisma migrate dev --name init

# عرض قاعدة البيانات في واجهة مرئية
npx prisma studio
```

---

## 9. مميزات التطبيق (Features Summary)

### 🔐 الأمان (Security)
- مصادقة آمنة باستخدام NextAuth
- تشفير كلمات المرور باستخدام bcryptjs
- دعم OAuth (Google)
- جلسات آمنة من جانب الخادم

### 🛒 التسوق والحجز (Shopping & Booking)
- حجز الرحلات الجوية
- حجز الفنادق
- حجز الجولات السياحية
- استئجار السيارات
- حساب السعر الديناميكي

### 💳 الدفع (Payment)
- تكامل Stripe للدفع الآمن
- دعم عملات متعددة
- معالجة الدفع من جانب الخادم

### 📱 الواجهة (UI/UX)
- تصميم حديث باستخدام Tailwind CSS
- رسوميات سلسة باستخدام Framer Motion
- أيقونات احترافية
- تنبيهات فورية (Toast)

### 📊 إدارة البيانات (Data Management)
- Prisma ORM لقاعدة البيانات
- State Management مع Zustand
- دعم JSON في الحقول المرنة

---

## 10. الخطوات التالية (Next Steps)

1. **تطوير المزيد من الميزات**: إضافة تقييمات وتعليقات المستخدمين
2. **تحسين الأداء**: تحسين استعلامات قاعدة البيانات والـ Caching
3. **تطبيق الجوال**: إنشاء تطبيق React Native أو Flutter
4. **لوحة تحكم المدير**: إنشاء Dashboard شامل للإدارة
5. **الترجمة**: دعم لغات متعددة (i18n)
6. **الاختبارات**: كتابة اختبارات شاملة (Unit Tests, E2E Tests)

---

**تاريخ التوثيق**: 26 يونيو 2026
**إصدار المشروع**: 0.1.0
**الحالة**: تطوير جاري 🚀
