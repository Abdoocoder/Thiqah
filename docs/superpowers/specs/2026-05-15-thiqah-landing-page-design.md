# Al-Thiqa Landing Page & Front-End Design

> **Project:** الثقة للمنتجات البلدية — موقع تجارة إلكترونية مع CMS
> **Date:** 2026-05-15
> **Status:** Approved Design

## Overview

موقع عرض وبيع منتجات بلدية (زيت زيتون، جبنة غنم، سمن بلدي) مع تجربة بصرية غنية بالأنيميشن. ينقسم الموقع إلى واجهة أمامية (Landing Page) للعملاء ولوحة تحكم (Admin CMS) للإدارة.

## Tech Stack

| التقنية | الاستخدام |
|---------|-----------|
| Vite 6 + React 19 | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| motion (Framer Motion) | UI micro-interactions |
| GSAP + ScrollTrigger | Scroll animations & parallax |
| Lenis | Smooth scrolling |
| React Router DOM v7 | Routing |
| React Hook Form + Zod | Forms & validation |
| lucide-react | Icons |

## Current Project State

المشروع الحالي مبني على Vite + React مع:
- صفحة رئيسية (Hero, Products, Story, Footer) — كلها في ملف `App.tsx` واحد
- لوحة تحكم أساسية (Dashboard, Products, Orders)
- توجيه RTL بالعربية
- Tailwind v4

## Architecture — Front-End Folder Structure

```
src/
  sections/
    PageLoader.tsx          ← أنيميشن شعار الدخول
    Navbar.tsx              ← شريط التنقل
    Hero.tsx                ← القسم الرئيسي مع CTA
    Products.tsx             ← بطاقات المنتجات
    Offers.tsx              ← عروض موسمية مع عدّاد
    Story.tsx               ← قصة المنتج مع parallax
    Testimonials.tsx        ← آراء العملاء
    Contact.tsx             ← نموذج تواصل + واتساب
    Footer.tsx              ← معلومات التواصل
  
  components/
    Button.tsx              ← زر مخصص (3 variants)
    ProductCard.tsx         ← بطاقة منتج
    WhatsAppButton.tsx      ← زر واتساب مبرمج
    CountdownTimer.tsx      ← عدّاد تنازلي
    TestimonialCard.tsx     ← بطاقة رأي عميل
  
  hooks/
    useCountdown.ts         ← عدّاد تنازلي
    useScrollReveal.ts      ← GSAP scroll reveal
  
  lib/
    constants.ts            ← بيانات المنتجات، الإعدادات
    whatsapp.ts             ← روابط واتساب
  
  admin/
    AdminLayout.tsx         ← هيكل لوحة التحكم (موجود)
    Dashboard.tsx           ← نظرة عامة (موجود)
    Products.tsx            ← إدارة منتجات (موجود)
    Orders.tsx              ← إدارة طلبات (موجود)
  
  App.tsx                   ← يجمع الأقسام مع BrowserRouter
```

## Landing Page Sections

### 1. Page Loader
- شعار "الثقة" يظهر مع أنيميشن fade-in/scale
- يستمر 2-3 ثواني
- يختفي مع أنيميشن سلس يكشف الـ Hero تحته
- **GSAP timeline** مع Lenis متزامن

### 2. Navbar (موجود، نحسّنه)
- شعار الثقة على اليمين
- روابط: الرئيسية، المنتجات، العروض، تواصل معنا
- زر AR/EN
- رابط "لوحة التحكم" للمشرفين
- لاصق (sticky) مع backdrop-blur

### 3. Hero Section (موجود، نضيف أنيميشن)
- صورة/فيديو خلفية مع overlay داكن
- عنوان رئيسي بانيميشن SplitText (GSAP)
- زر CTA "اطلب الآن عبر واتساب"
- أنيميشن دخول متسلسل (عنوان → زر)

### 4. Products Section (موجود، نحسّنه)
- 3 منتجات: زيت زيتون، جبنة غنم، سمن بلدي
- بطاقات مع hover (رفع الصورة + scale)
- زر "طلب عبر واتساب" لكل منتج
- ترتيب غير متماثل (مثل الموجود: md:mt-12 للبطاقة الوسطى)

### 5. Offers Section (جديد)
- عروض موسمية مع عدّاد تنازلي (useCountdown hook)
- بطاقة عرض مع صورة + سعر مخفض
- أنيميشن GSAP ScrollTrigger للظهور

### 6. Story Section (موجود، parallax أقوى)
- مسار بصري: مزرعة → إنتاج → مائدة
- GSAP ScrollTrigger parallax للصورة الخلفية
- أنيميشن ظهور تدريجي للنص مع scroll
- زر "اكتشف المزيد"

### 7. Testimonials Section (جديد)
- 3-4 آراء عملاء مع صور وأسماء
- أنيميشن ظهور كلمة كلمة (GSAP SplitText)
- بطاقات بتصميم نظيف

### 8. Contact Section (جديد)
- نموذج تواصل: الاسم، البريد، الرسالة
- التحقق: React Hook Form + Zod
- زر واتساب مباشر: `https://wa.me/962779248914?text=...`
- رسالة واتساب مُعدة مسبقاً بالعربية

### 9. Footer (موجود، نحسّنه)
- اسم المتجر + الشعار
- روابط سريعة
- رقم الهاتف: 0779248914
- حقوق النشر

## Animation Strategy

| النوع | الأداة | الموقع |
|-------|--------|--------|
| Scroll-triggered reveals | GSAP + ScrollTrigger | Story, Testimonials, Offers |
| Smooth scrolling | Lenis | الصفحة بأكملها |
| Parallax backgrounds | GSAP ScrollTrigger | Hero, Story |
| Text split animation | GSAP SplitText | Hero title, Testimonials |
| UI micro-interactions | motion (Framer Motion) | Buttons, Cards, Navbar |
| Countdown animation | CSS + React state | Offers timer |
| Page Loader | GSAP timeline | دخول الموقع |

## Routes

| المسار | المكون | الوصف |
|--------|--------|-------|
| `/` | LandingPage | الصفحة الرئيسية للعملاء |
| `/admin` | Dashboard | لوحة التحكم — نظرة عامة |
| `/admin/products` | Products | إدارة المنتجات |
| `/admin/orders` | Orders | إدارة الطلبات |

## Data Flow (Phase 1 — Static)

المرحلة الأولى تستخدم بيانات ثابتة في `lib/constants.ts`:
- قائمة المنتجات
- العروض
- آراء العملاء
- معلومات المتجر

الربط مع Convex و API سيكون في مرحلة لاحقة (Phase 3).

## WhatsApp Integration

جميع أزرار "اطلب الآن" و "طلب عبر واتساب" تفتح:
```
https://wa.me/962779248914?text=السلام+عليكم،+أرغب+في+طلب+[اسم+المنتج]
```

## Responsive Design

- `min-h-[100dvh]` بدلاً من `h-screen` للأقسام الكاملة
- Grid للأقسام (maintain grid layout للديسكتوب، single column للموبايل)
- RTL في كل الصفحات
- Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Next Steps

1. تثبيت المكتبات الجديدة (GSAP, Lenis, React Hook Form, Zod)
2. إنشاء مجلدات `sections/`, `components/`, `hooks/`, `lib/`
3. فصل المكونات من App.tsx إلى ملفات منفصلة
4. بناء Page Loader
5. تحسين Navbar
6. إضافة أنيميشنات للـ Hero
7. تحسين Products
8. بناء Offers مع عدّاد
9. تطوير Story parallax
10. بناء Testimonials
11. بناء Contact form
12. تحسين Footer
