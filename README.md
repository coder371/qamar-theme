# Qamar Theme

ثيم قمرة الرسمي لمتاجر التجارة الإلكترونية المتخصصة في منتجات المرأة والجمال.

---

## معلومات الثيم

| الخاصية | القيمة |
|---------|--------|
| **الاسم** | Qamar Theme |
| **الإصدار** | 1.0.0 |
| **Theme ID** | `697518a96e7a04856bcc4ef0` |
| **المنصة** | Qumra Cloud |
| **اللغات** | العربية، الإنجليزية، الفرنسية |
| **الاتجاه** | RTL |
| **الفئة المستهدفة** | متاجر منتجات المرأة والجمال |

---

## هوية الثيم

### الفئة المستهدفة

ثيم **Qamar** مصمم خصيصاً للمتاجر التي تستهدف المرأة، ويشمل:

- **مستحضرات التجميل** (Cosmetics)
- **الملابس النسائية** (Women's Clothing)
- **منتجات العناية بالبشرة والشعر** (Skincare & Haircare)
- **الإكسسوارات النسائية** (Women's Accessories)
- **العطور** (Perfumes)
- **كل ما يتعلق بالجمال والأناقة**

### إرشادات التصميم للـ AI

> **مهم للـ AI:** عند إنشاء أو تعديل أي تصميم في هذا الثيم، يجب الالتزام بالمعايير التالية:

#### الألوان

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| **Primary** | `#9C27B0` | الأزرار الرئيسية، الروابط، العناصر المميزة |
| **Primary Light** | `#CE93D8` | Hover states، خلفيات خفيفة |
| **Primary Dark** | `#7B1FA2` | Active states، نصوص على خلفية فاتحة |
| **Secondary** | `#F48FB1` | أزرار ثانوية، شارات، تمييز |
| **Secondary Light** | `#FBBAD7` | خلفيات، borders |
| **Background** | `#FFFFFF` | خلفية الصفحة |
| **Surface** | `#FAFAFA` | خلفية البطاقات والأقسام |
| **Text Primary** | `#212121` | النصوص الرئيسية |
| **Text Secondary** | `#757575` | النصوص الثانوية |
| **Border** | `#E0E0E0` | الحدود والفواصل |
| **Success** | `#4CAF50` | رسائل النجاح، متوفر |
| **Error** | `#F44336` | رسائل الخطأ، غير متوفر |
| **Warning** | `#FF9800` | تحذيرات |

**CSS Variables:**
```css
:root {
  --color-primary: #9C27B0;
  --color-primary-light: #CE93D8;
  --color-primary-dark: #7B1FA2;
  --color-secondary: #F48FB1;
  --color-secondary-light: #FBBAD7;
  --color-background: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-text-primary: #212121;
  --color-text-secondary: #757575;
  --color-border: #E0E0E0;
  --color-success: #4CAF50;
  --color-error: #F44336;
  --color-warning: #FF9800;
}
```

#### الخطوط

| الخط | اللغة | الاستخدام |
|------|-------|-----------|
| **Tajawal** | العربية | جميع النصوص العربية |
| **Poppins** | الإنجليزية | جميع النصوص الإنجليزية |

**أحجام الخطوط:**

| الحجم | القيمة | الاستخدام |
|-------|--------|-----------|
| `xs` | 12px | نصوص صغيرة، تسميات |
| `sm` | 14px | نصوص ثانوية |
| `base` | 16px | النص الأساسي |
| `lg` | 18px | نصوص بارزة |
| `xl` | 20px | عناوين صغيرة |
| `2xl` | 24px | عناوين متوسطة |
| `3xl` | 30px | عناوين كبيرة |
| `4xl` | 36px | عناوين رئيسية |

**CSS Variables:**
```css
:root {
  --font-arabic: 'Tajawal', sans-serif;
  --font-english: 'Poppins', sans-serif;
  --font-family: var(--font-arabic);
}

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

#### الصور والأيقونات
- صور عالية الجودة تعكس الجمال والأناقة
- أيقونات بسيطة وأنيقة (outline style)
- استخدام مساحات بيضاء كافية

#### التخطيط العام
- تصميم نظيف ومرتب
- مساحات بيضاء واسعة (whitespace)
- تركيز على إبراز المنتجات بشكل جذاب
- أنيميشن ناعمة وبسيطة

#### تجربة المستخدم
- سهولة التنقل
- عرض المنتجات بطريقة جذابة
- التركيز على الصور والتفاصيل البصرية

---

## الوصف

ثيم احترافي مصمم للمتاجر العربية المتخصصة في منتجات المرأة والجمال، يدعم RTL بشكل كامل مع تصميم عصري أنيق يعكس روح الأنوثة والجمال.

---

## التوثيق

> **للـ AI والمطورين:** جميع التوثيق التفصيلي لبناء الثيمات متاح في مجلد [`docs/`](./docs/)

### ملفات مهمة

| الملف | الوصف |
|-------|-------|
| [`THEME-REQUIREMENTS.md`](./THEME-REQUIREMENTS.md) | جميع الويدجات المطلوبة ومواصفاتها |
| [`docs/`](./docs/) | التوثيق التقني لبناء الثيمات |

```
docs/
├── getting-started/    # البدء السريع والتثبيت
├── theme-structure/    # بنية الثيم (layouts, pages, widgets, settings, etc.)
├── qalab/              # لغة القوالب (variables, filters, tags)
├── store-ajax/         # Store AJAX API (cart, wishlist, search, product)
├── tools/              # الأدوات (CLI, VS Code Extension)
└── examples/           # أمثلة عملية جاهزة
```

### روابط سريعة

- [البدء السريع](./docs/getting-started/)
- [المتغيرات](./docs/qalab/variables.md) - `store`, `cart`, `wishlist`, `localization`
- [الفلاتر](./docs/qalab/filters.md) - `| money`, `| assets`, `| default`
- [الويدجات](./docs/theme-structure/widgets.md) - إنشاء ويدجات جديدة
- [Store AJAX](./docs/store-ajax/) - Cart, Wishlist, Search, Product APIs
- [الأمثلة](./docs/examples/) - أمثلة جاهزة للاستخدام

---

## البدء السريع

```bash
# تشغيل خادم التطوير
qumra theme dev

# إنشاء ويدجت جديد
qumra gen widget <name>

# نشر الثيم
qumra theme publish
```

---

## هيكل الملفات

```
Qamar-Theme/
├── .qumra/              # تكوين الثيم
├── assets/              # CSS, JS, Media
├── layouts/             # التخطيطات
├── locales/             # الترجمة
├── pages/               # الصفحات
├── settings/            # الإعدادات
├── templates/           # القوالب (header, footer)
├── ui/                  # مكونات UI
├── widgets/             # الويدجات
└── docs/                # التوثيق الكامل
```

---

## الترخيص

جميع الحقوق محفوظة لـ Qumra Cloud.
