# أوامر Qumra CLI

أداة سطر الأوامر لتطوير ونشر ثيمات قمرة.

## التثبيت

```bash
npm install -g @aspect2/qumra-cli
```

---

## تسجيل الدخول

```bash
qumra user login
```

يفتح المتصفح لتسجيل الدخول إلى حساب قمرة.

---

## إنشاء ثيم جديد

```bash
qumra theme new
```

ينشئ مشروع ثيم جديد مع البنية الأساسية.

---

## تطوير الثيم

### تشغيل خادم التطوير

```bash
qumra theme dev
```

يشغل خادم محلي لمعاينة الثيم مع إعادة التحميل التلقائي عند التغييرات.

---

## إنشاء عناصر جديدة

### إنشاء ويدجت

```bash
qumra gen widget <widget-name>
```

**أمثلة:**
```bash
qumra gen widget hero-banner
qumra gen widget product-slider
qumra gen widget faq-accordion
```

**ينشئ:**
```
widgets/
└── hero-banner/
    ├── schema.json
    └── widget.njk
```

> **ملاحظة:** أسماء الويدجات يجب أن تكون بأحرف صغيرة مع أرقام وشرطات فقط.

---

## نشر الثيم

### نشر نسخة جديدة

```bash
qumra theme publish
```

### أنواع النسخ

| النوع | الوصف | مثال |
|-------|-------|------|
| `patch` | إصلاحات صغيرة | 1.0.0 → 1.0.1 |
| `minor` | ميزات جديدة | 1.0.0 → 1.1.0 |
| `major` | تغييرات كبيرة | 1.0.0 → 2.0.0 |

```bash
# نشر إصلاح صغير
qumra theme publish --patch

# نشر ميزة جديدة
qumra theme publish --minor

# نشر تغيير كبير
qumra theme publish --major
```

---

## ملخص الأوامر

| الأمر | الوصف |
|-------|-------|
| `qumra user login` | تسجيل الدخول |
| `qumra theme new` | إنشاء ثيم جديد |
| `qumra theme dev` | تشغيل خادم التطوير |
| `qumra gen widget <name>` | إنشاء ويدجت جديد |
| `qumra theme publish` | نشر الثيم |
| `qumra theme publish --patch` | نشر إصلاح |
| `qumra theme publish --minor` | نشر ميزة |
| `qumra theme publish --major` | نشر تغيير كبير |

---

## نصائح

1. **تأكد من تسجيل الدخول** قبل أي عملية
2. **استخدم `theme dev`** أثناء التطوير لمعاينة التغييرات فوراً
3. **أنشئ الويدجات بـ CLI** بدلاً من إنشاء الملفات يدوياً
4. **اختر نوع النسخة المناسب** عند النشر
