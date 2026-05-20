# 🔥 إعداد Firebase — الدليل الكامل بالعربية

هذا الدليل يشرح كيف تربط موقعك بقاعدة بيانات حقيقية مشتركة لكل الطلاب.

**ما الذي ستحصل عليه:**
- ✅ تسجيل دخول حقيقي (Google + GitHub + بريد إلكتروني)
- ✅ عدد الأعضاء يتراكم ويبقى ظاهراً للجميع
- ✅ لوحة صدارة عالمية يراها كل من يدخل
- ✅ بث مباشر للنشاط (من خلّص أي اختبار، شكد نتيجته)
- ✅ كل طالب يرى أصدقاءه وأحدث الأعضاء

**التكلفة: مجاناً تماماً** ضمن الحدود السخية التي تقدمها Google.

---

## 1. إنشاء مشروع Firebase

1. اذهب إلى [console.firebase.google.com](https://console.firebase.google.com)
2. سجّل دخولك بحساب Google
3. اضغط **"إضافة مشروع"** (Add project)
4. اكتب اسم المشروع: مثلاً `quiz-platform`
5. اضغط **Continue** (يمكنك إيقاف Google Analytics إذا لم ترد)
6. اضغط **Create project** وانتظر ~30 ثانية

---

## 2. تفعيل المصادقة (Authentication)

1. من القائمة اليسرى: **Build → Authentication**
2. اضغط **Get started**
3. تحت **Sign-in method** فعّل المزوّدين التالية:

   **Email/Password:**
   - اضغط على Email/Password
   - فعّل المفتاح الأول (Email/Password)
   - **Save**

   **Google:**
   - اضغط على Google
   - فعّل المفتاح
   - اختر **Support email** (إيميلك)
   - **Save**

   **GitHub** (اختياري):
   - يحتاج إنشاء OAuth App على GitHub أولاً
   - تخطّ هذا الآن إذا أردت — Google + Email كافيان للبداية

---

## 3. إنشاء قاعدة البيانات (Firestore)

1. من القائمة اليسرى: **Build → Firestore Database**
2. اضغط **Create database**
3. اختر **Start in production mode** (سنضع القواعد بعد قليل)
4. اختر موقع الخادم: **eur3 (Europe)** أو **us-central1** (الأقرب للعراق)
5. اضغط **Enable**

### 3.1 إعداد قواعد الأمان

في Firestore، اضغط تبويب **Rules** والصق هذا:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // المستخدمون: كل مستخدم يقرأ/يكتب وثيقته فقط، الجميع يقرأ أسماء الآخرين
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // المحاولات: مسجّل دخول فقط يكتب باسمه، الجميع يقرأ
    match /attempts/{attemptId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

اضغط **Publish** للحفظ.

---

## 4. الحصول على إعدادات الموقع

1. من القائمة اليسرى: **اضغط ⚙️ بجانب Project Overview → Project settings**
2. انزل لأسفل لـ **Your apps**
3. اضغط أيقونة الويب **`</>`**
4. اكتب اسماً: مثلاً `quiz-web`
5. **لا** تختر "Set up Firebase Hosting"
6. اضغط **Register app**
7. سيظهر لك كائن مثل هذا:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "quiz-platform-xxx.firebaseapp.com",
  projectId: "quiz-platform-xxx",
  storageBucket: "quiz-platform-xxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

**انسخ هذه القيم بالضبط** — ستحتاجها للخطوة التالية.

---

## 5. لصق الإعدادات في الكود

افتح ملف `src/firebase.js` في VS Code أو على GitHub.

ابحث عن:
```javascript
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  ...
};
```

**استبدل كل قيمة بالقيمة الحقيقية** من الخطوة 4.

---

## 6. إضافة Firebase للنطاقات المعتمدة

في Firebase Console:
1. **Authentication → Settings → Authorized domains**
2. أضف:
   - دومين Vercel/Cloudflare الخاص بك (مثلاً `quiz-platform.vercel.app`)
   - `localhost` موجود تلقائياً للتطوير المحلي

---

## 7. اختبار محلي

```bash
npm install         # سيحمّل firebase تلقائياً
npm run dev
```

افتح `http://localhost:5173` وجرّب التسجيل.

---

## 8. النشر

```bash
git add .
git commit -m "Add Firebase integration"
git push
```

Cloudflare/Vercel سيُحدّث الموقع تلقائياً خلال دقيقة.

---

## ⚠️ ملاحظات مهمة

### عن أمان مفاتيح Firebase:
- مفاتيح Firebase في firebaseConfig **آمنة للنشر العلني** — هكذا Firebase صُمم
- الأمان الحقيقي يأتي من **قواعد Firestore** (التي ضبطناها في الخطوة 3.1)

### عن الفوترة:
- خطة Firebase المجانية (**Spark Plan**) تكفي لـ:
  - 50,000 قراءة/يوم
  - 20,000 كتابة/يوم
  - 1 GB تخزين
- لـ موقع تعليمي بطلاب قسم واحد، **هذا أكثر من كافٍ بكثير**

### عن المسؤول (Admin):
- لوحة الإدارة الحالية تستخدم localStorage فقط لمسوّدات JSON
- الأسئلة الـ 100 مدمجة في الكود مباشرة
- لإضافة أسئلة جديدة: عدّل `DEFAULT_NOVEL_QUESTIONS` في الكود وادفع لـ GitHub

---

## 🎉 تم!

بعد اتباع هذه الخطوات، موقعك سيدعم:
- تسجيل دخول حقيقي بـ Google + Email
- بيانات مشتركة بين كل الطلاب
- لوحة صدارة وعداد أعضاء حقيقيان
- ميزات اجتماعية مباشرة

أي مشكلة؟ تواصل مع المطوّر:
- 📷 [Instagram @ham7_d](https://www.instagram.com/ham7_d)
- ✈️ [Telegram @m0_h0](https://t.me/m0_h0)
