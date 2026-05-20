# 🎓 منصة الاختبارات | قسم اللغة الإنجليزية

موقع اختبارات تفاعلي بأسلوب MCQ لطلاب قسم اللغة الإنجليزية - المرحلة الثالثة.
محتوى الموقع جاهز ومدمج (100 سؤال عن Wuthering Heights)، مع نظام إدارة وتصميم احترافي.

---

## 📋 المحتويات

1. [التحميل والتشغيل المحلي](#1-التشغيل-المحلي-على-جهازك)
2. [التعديل في VS Code](#2-التعديل-في-vs-code)
3. [الرفع إلى GitHub](#3-الرفع-إلى-github)
4. [النشر على الإنترنت بـ Vercel](#4-النشر-على-الإنترنت-vercel)
5. [إضافة الموقع لـ Google Search](#5-إظهار-الموقع-في-google-search)

---

## 1. التشغيل المحلي على جهازك

### ① ثبّت Node.js
- اذهب إلى [https://nodejs.org](https://nodejs.org)
- نزّل النسخة **LTS** (الموصى بها)
- ثبّتها (Next → Next → Finish)

للتأكد، افتح Terminal أو CMD واكتب:
```bash
node -v
npm -v
```
لازم يظهر رقم النسخة.

### ② ثبّت VS Code
- اذهب إلى [https://code.visualstudio.com](https://code.visualstudio.com)
- نزّل وثبّت.

### ③ افتح المشروع
- فك ضغط مجلد `quiz-platform`
- في VS Code: `File → Open Folder` → اختر المجلد
- افتح Terminal داخل VS Code: `Terminal → New Terminal`

### ④ ثبّت الحزم وشغّل الموقع
```bash
npm install
npm run dev
```

راح تشوف رابط مثل:
```
➜  Local:   http://localhost:5173/
```
افتحه في المتصفح. **الموقع يشتغل!** 🎉

---

## 2. التعديل في VS Code

### الملفات المهمة:
- **`src/QuizPlatform.jsx`** — كل الكود (الواجهات، الأسئلة، المنطق)
- **`index.html`** — العنوان والوصف والكلمات المفتاحية لـ Google
- **`src/index.css`** — تنسيقات عامة

### تعديل كلمة مرور لوحة الإدارة:
في `src/QuizPlatform.jsx` ابحث عن:
```js
const ADMIN_PASSWORD = 'mjassim2026';
```
غيّرها لما تريد.

### تعديل الأسئلة المدمجة:
في نفس الملف ابحث عن:
```js
const DEFAULT_NOVEL_QUESTIONS = [
```
هذه قائمة الـ 100 سؤال — يمكنك إضافة/حذف/تعديل.

### إضافة أسئلة لمواد أخرى:
ابحث عن:
```js
const DEFAULT_QUESTIONS = {
  novel: DEFAULT_NOVEL_QUESTIONS,
};
```
أضف مادة جديدة:
```js
const DEFAULT_QUESTIONS = {
  novel: DEFAULT_NOVEL_QUESTIONS,
  poetry: DEFAULT_POETRY_QUESTIONS,  // مع تعريف المصفوفة فوق
  grammar: DEFAULT_GRAMMAR_QUESTIONS,
};
```

### تعديل حسابات السوشل ميديا:
ابحث عن:
```js
const SOCIAL = {
  instagram: 'https://www.instagram.com/...',
  telegram: 'https://t.me/...',
};
```

أي تعديل تسوّيه راح يُحدّث في المتصفح **فوراً** (Hot Reload).

---

## 3. الرفع إلى GitHub

### ① أنشئ حساب GitHub
[https://github.com/signup](https://github.com/signup) — مجاني.

### ② أنشئ Repository جديد
- اضغط على `+` فوق يمين → `New repository`
- اسم: `quiz-platform` (أو أي اسم تريده)
- اختر **Public**
- لا تختار "Add README" — احنا عدنا واحد
- اضغط **Create repository**

### ③ ارفع الكود
في Terminal داخل VS Code (داخل مجلد المشروع):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/quiz-platform.git
git push -u origin main
```

استبدل `USERNAME` باسم المستخدم مالك.

في أول مرة راح يطلب منك تسجيل دخول — استخدم اسم المستخدم وكلمة المرور (أو Personal Access Token).

---

## 4. النشر على الإنترنت (Vercel)

**Vercel** = خدمة استضافة مجانية وممتازة لمواقع React.

### ① أنشئ حساب Vercel
- اذهب [https://vercel.com/signup](https://vercel.com/signup)
- اختر **Continue with GitHub** (الأسهل)

### ② استورد المشروع
- في Vercel Dashboard اضغط **Add New** → **Project**
- شوف repository `quiz-platform` في القائمة → اضغط **Import**
- لا تغيّر أي إعدادات — Vercel ذكي ويعرف إنه Vite + React
- اضغط **Deploy**

بعد ~2 دقيقة، راح يجهز موقعك مع رابط مثل:
```
https://quiz-platform-username.vercel.app
```

**موقعك الآن على الإنترنت!** 🌍

### ③ أي تعديل لاحق:
عدّل الكود في VS Code → احفظ → اعمل push لـ GitHub:
```bash
git add .
git commit -m "وصف التعديل"
git push
```
Vercel راح ينشر التحديث **تلقائياً** خلال دقيقة.

---

## 5. إظهار الموقع في Google Search

### ① Google Search Console
- اذهب [https://search.google.com/search-console](https://search.google.com/search-console)
- سجّل دخول بحساب Google
- اضغط **Add Property** → اختر **URL prefix**
- ألصق رابط موقعك من Vercel
- Google راح يطلب منك التحقق — أسهل طريقة "HTML tag":
  - انسخ الـ meta tag اللي يعطيك إياه
  - ألصقه في `index.html` بين `<head>` و `</head>`
  - ارفع التغيير (push to GitHub) → Vercel ينشر تلقائياً
  - ارجع لـ Search Console واضغط **Verify**

### ② أرسل خريطة الموقع
في Search Console:
- `Sitemaps` من القائمة الجانبية
- اكتب `sitemap.xml` واضغط Submit

(Vite ما يولّد sitemap تلقائياً — يمكنك تركها أو تضيف plugin لاحقاً)

### ③ اطلب فهرسة الصفحة
- في Search Console، فوق ادخل رابط موقعك في صندوق البحث
- اضغط **Request Indexing**
- Google راح يفحص الموقع خلال أيام (أحياناً أسابيع)

### ④ نصائح لظهور أفضل:
- العنوان والوصف في `index.html` (موجودين أصلاً، عدّلهم إذا تريد)
- شارك الرابط على وسائل التواصل (إنستغرام، تيليجرام، تويتر)
- اطلب من زملائك يدخلون الموقع (إشارة جودة لـ Google)
- اذكر اسمك ومحتوى الموقع في كلام واضح

---

## ⚠️ ملاحظات مهمة

### عن التخزين:
- في النسخة المنشورة، **كل زائر يخزّن نتائجه في متصفحه فقط** (localStorage)
- يعني لوحة الصدارة محلية لكل زائر — لا توجد قاعدة بيانات مشتركة
- إذا أردت قاعدة بيانات مشتركة لاحقاً، يمكنك إضافة **Firebase** أو **Supabase**

### عن كلمة المرور:
- كلمة مرور المسؤول مكتوبة في الكود → ظاهرة لمن يفتح "View Source"
- لاستخدام شخصي/تعليمي ما يضر، لكن لا تخلّيها كلمة مرور مهمة

### للأمان أكثر:
- استخدم متغيرات بيئة `.env` (لكن تعقيد إضافي)
- أو استخدم backend (Firebase Auth) — مشروع لاحق

---

## 🚀 الأوامر السريعة

```bash
npm install         # تثبيت الحزم (مرة واحدة)
npm run dev         # تشغيل محلي
npm run build       # بناء نسخة الإنتاج
npm run preview     # معاينة نسخة الإنتاج محلياً
```

---

## 📞 معلومات المطور

**محمد جاسم معاريج**
- 📷 Instagram: [@ham7_d](https://www.instagram.com/ham7_d)
- ✈️ Telegram: [@m0_h0](https://t.me/m0_h0)

قسم اللغة الإنجليزية · المرحلة الثالثة · جامعة واسط

---

## 📜 الترخيص

استخدام شخصي وتعليمي حر.
