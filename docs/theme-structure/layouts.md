# التخطيطات (Layouts)

التخطيط هو الهيكل الأساسي لجميع صفحات الثيم.

## الموقع

```
layouts/
├── layout.njk           # التخطيط الافتراضي
├── layout-full.njk      # تخطيط بدون هيدر/فوتر (اختياري)
└── layout-checkout.njk  # تخطيط صفحة الدفع (اختياري)
```

---

## التخطيط الأساسي

```nunjucks
<!DOCTYPE html>
<html lang="{{ localization.language }}" dir="{% if localization.language == 'en' %}ltr{% else %}rtl{% endif %}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  {# SEO Meta Tags #}
  {% seo %}

  {# موارد قمرة #}
  {% qumra_head %}

  {# Tailwind CSS - مطلوب استدعاؤه يدوياً #}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: 'var(--color-primary)',
            'primary-light': 'var(--color-primary-light)',
            'primary-dark': 'var(--color-primary-dark)',
            secondary: 'var(--color-secondary)',
            surface: 'var(--color-surface)',
          },
          fontFamily: {
            arabic: ['Tajawal', 'sans-serif'],
            english: ['Poppins', 'sans-serif'],
          }
        }
      }
    }
  </script>

  {# Google Fonts #}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">

  {# متغيرات CSS #}
  <style>
    :root {
      --color-primary: {{ settings.primaryColor | default('#9C27B0') }};
      --color-primary-light: {{ settings.primaryColorLight | default('#CE93D8') }};
      --color-primary-dark: {{ settings.primaryColorDark | default('#7B1FA2') }};
      --color-secondary: {{ settings.secondaryColor | default('#F48FB1') }};
      --color-surface: {{ settings.surfaceColor | default('#FAFAFA') }};
    }
  </style>

  {# CSS مخصص #}
  <link rel="stylesheet" href="{{ 'style.css' | assets }}"/>
</head>
<body class="bg-gray-50 text-gray-900">

  {# الهيدر #}
  {% template "header" %}

  {# المحتوى الرئيسي #}
  <main class="min-h-screen">
    {% content %}
  </main>

  {# الفوتر #}
  {% template "footer" %}

  {# Alpine.js - مطلوب استدعاؤه يدوياً #}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  {# سكربتات قمرة #}
  {% qumra_scripts %}

  {# JavaScript مخصص #}
  <script src="{{ 'main.js' | assets }}"></script>
</body>
</html>
```

---

## شرح المكونات

### تعريف HTML

```nunjucks
<html lang="{{ localization.language }}" dir="rtl">
```

- `lang` - اللغة الحالية
- `dir="rtl"` - اتجاه النص

### SEO

```nunjucks
{% seo %}
```

يدرج تلقائياً:
- `<title>`
- `<meta name="description">`
- Open Graph tags
- Twitter Card tags

### موارد قمرة

```nunjucks
{% qumra_head %}
```

يدرج موارد قمرة الأساسية (لا يشمل Tailwind CSS).

---

## المكتبات المطلوبة

> **مهم**: جميع مكتبات الفرونت إند يجب استدعاؤها يدوياً في الـ Layout.

### 1. Tailwind CSS

```nunjucks
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
          secondary: 'var(--color-secondary)',
          surface: 'var(--color-surface)',
        },
        fontFamily: {
          arabic: ['Tajawal', 'sans-serif'],
          english: ['Poppins', 'sans-serif'],
        }
      }
    }
  }
</script>
```

**الاستخدام:**
- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary`
- `bg-surface`
- `font-arabic`, `font-english`

### 2. Google Fonts

> **مهم**: الخطوط يجب استدعاؤها يدوياً من Google Fonts أو أي مصدر آخر.

```nunjucks
{# Preconnect للأداء #}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

{# تحميل الخطوط #}
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
```

**الخطوط المستخدمة:**

| الخط | الاستخدام | الأوزان |
|------|-----------|---------|
| **Tajawal** | النصوص العربية | 300, 400, 500, 700 |
| **Poppins** | النصوص الإنجليزية | 300, 400, 500, 600, 700 |

**تعريف الخطوط في CSS:**

```css
:root {
  --font-arabic: 'Tajawal', sans-serif;
  --font-english: 'Poppins', sans-serif;
}

/* الخط الافتراضي (عربي) */
html, body {
  font-family: 'Tajawal', var(--font-arabic), sans-serif;
}

/* الخط الإنجليزي */
html[lang="en"],
html[lang="en"] body,
html[dir="ltr"],
html[dir="ltr"] body {
  font-family: 'Poppins', var(--font-english), sans-serif;
}

/* توريث الخط للعناصر */
button, input, select, textarea {
  font-family: inherit;
}
```

**استخدام خطوط أخرى:**

يمكنك استبدال الخطوط بأي خطوط من Google Fonts:

```nunjucks
{# مثال: Cairo + Inter #}
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**خطوط عربية موصى بها:**
- **Tajawal** - حديث ونظيف
- **Cairo** - واضح وقابل للقراءة
- **Almarai** - عصري
- **IBM Plex Sans Arabic** - احترافي
- **Noto Sans Arabic** - شامل

### 3. Swiper.js

للسلايدرات والكاروسيل.

```nunjucks
{# CSS في head #}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

{# JS في body #}
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

**الاستخدام:**
```html
<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>

<script>
  new Swiper('.swiper', {
    loop: true,
    pagination: { el: '.swiper-pagination' },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
</script>
```

### 4. GLightbox

لمعرض الصور والـ Lightbox.

```nunjucks
{# CSS في head #}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">

{# JS في body #}
<script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>
<script>
  GLightbox({ selector: '.glightbox' });
</script>
```

**الاستخدام:**
```html
<a href="image-large.jpg" class="glightbox">
  <img src="image-thumb.jpg" alt="صورة">
</a>
```

### 5. Alpine.js

للتفاعل والـ State Management.

```nunjucks
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

**الاستخدام:**
```html
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">Content</div>
</div>
```

### 6. Animate.css (اختياري)

للحركات والـ Animations.

```nunjucks
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">
```

**الاستخدام:**
```html
<div class="animate__animated animate__fadeIn">
  محتوى متحرك
</div>
```

### متغيرات CSS

```nunjucks
<style>
  :root {
    --mainColor: {{ settings.mainColor }};
  }
</style>
```

### القوالب

```nunjucks
{% template "header" %}
{% template "footer" %}
```

### المحتوى

```nunjucks
{% content %}
```

يعرض الويدجات المحددة في ملف الصفحة.

### السكربتات

```nunjucks
{% qumra_scripts %}
```

يدرج سكربتات قمرة الأساسية.

### Alpine.js

> **مهم**: يجب استدعاء Alpine.js يدوياً قبل `{% qumra_scripts %}`.

```nunjucks
{# Alpine.js - مطلوب استدعاؤه يدوياً #}
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

{% qumra_scripts %}
```

Alpine.js يُستخدم للتفاعل مع:
- `x-data` - تعريف البيانات
- `x-show` / `x-if` - إظهار/إخفاء العناصر
- `x-for` - الحلقات
- `x-on` / `@click` - الأحداث
- `x-model` - الربط ثنائي الاتجاه
- `x-transition` - الحركات

---

## دعم RTL و LTR

### تلقائي حسب اللغة

```nunjucks
<html lang="{{ localization.language }}"
      dir="{% if localization.language == 'ar' %}rtl{% else %}ltr{% endif %}">
```

### Tailwind CSS مع RTL

```nunjucks
{# هوامش تتغير حسب الاتجاه #}
<div class="mr-4 rtl:ml-4 rtl:mr-0">

{# أو باستخدام logical properties #}
<div class="ms-4">  {# margin-start #}
<div class="me-4">  {# margin-end #}
```

---

## تخطيطات متعددة

### استخدام تخطيط مختلف

في ملف الصفحة (`pages/*.json`):

```json
{
  "layout": "layout-checkout",
  "widgets": []
}
```
