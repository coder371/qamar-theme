# الأصول (Assets)

مجلد الأصول يحتوي على ملفات CSS و JavaScript والوسائط.

## الموقع

```
assets/
├── style.css        # التنسيقات الأساسية
├── main.js          # JavaScript الرئيسي
├── cart.js          # وظائف السلة
├── product.js       # وظائف المنتج
├── search.js        # وظائف البحث
└── images/          # الصور (اختياري)
    ├── logo.png
    └── icons/
```

---

## أنواع الملفات

### ملفات CSS

```
*.css - ملفات التنسيق
```

مثال `style.css`:
```css
/* متغيرات CSS */
:root {
  --primary-color: var(--mainColor);
  --text-color: #333;
  --bg-color: #fff;
}

/* تنسيقات مخصصة */
.custom-button {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
}
```

### ملفات JavaScript

```
*.js - ملفات التفاعل
```

مثال `main.js`:
```javascript
// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  initializeCart();
});

function initializeSearch() {
  // كود البحث
}

function initializeCart() {
  // كود السلة
}
```

### ملفات الوسائط

```
*.webp, *.png, *.jpg, *.svg - صور
*.mp4, *.webm - فيديوهات
*.woff2, *.woff - خطوط
```

---

## استخدام الأصول في القوالب

### باستخدام `| assets` filter

```nunjucks
{# CSS #}
<link rel="stylesheet" href="{{ 'style.css' | assets }}">

{# JavaScript #}
<script src="{{ 'main.js' | assets }}"></script>

{# صورة #}
<img src="{{ 'images/logo.png' | assets }}" alt="Logo">

{# أيقونة #}
<img src="{{ 'images/icons/cart.svg' | assets }}" alt="Cart">
```

### في layout.njk

```nunjucks
<!DOCTYPE html>
<html>
<head>
  {% seo %}
  {% qumra_head %}

  {# CSS مخصص #}
  <link rel="stylesheet" href="{{ 'style.css' | assets }}">
</head>
<body>
  {% template "header" %}
  <main>{% content %}</main>
  {% template "footer" %}

  {% qumra_scripts %}

  {# JavaScript مخصص #}
  <script src="{{ 'main.js' | assets }}"></script>
  <script src="{{ 'cart.js' | assets }}"></script>
</body>
</html>
```

---

## أفضل الممارسات

### 1. أسماء ملفات واضحة

```
✅ style.css
✅ cart.js
✅ product-slider.js

❌ s.css
❌ script1.js
❌ temp.js
```

### 2. تنظيم الصور

```
assets/
└── images/
    ├── logo.webp
    ├── placeholder.webp
    ├── icons/
    │   ├── cart.svg
    │   ├── search.svg
    │   └── menu.svg
    └── banners/
        ├── hero-1.webp
        └── hero-2.webp
```

### 3. صيغ الصور المفضلة

| الصيغة | الاستخدام |
|--------|----------|
| WebP | الصور العامة (أفضل ضغط) |
| SVG | الأيقونات والرسومات البسيطة |
| PNG | الصور بخلفية شفافة |

### 4. ترتيب تحميل JavaScript

```nunjucks
{# المكتبات أولاً #}
{% qumra_scripts %}

{# ثم الملفات المعتمدة على المكتبات #}
<script src="{{ 'main.js' | assets }}"></script>
<script src="{{ 'cart.js' | assets }}"></script>
```

### 5. تقليل حجم الملفات

- ضغط الصور قبل الرفع
- تصغير CSS و JavaScript في الإنتاج
- استخدام lazy loading للصور

---

## مثال ملف cart.js

```javascript
// وظائف السلة
async function addToCart(productId) {
  const res = await fetch('/ajax/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });

  if (res.ok) {
    const data = await res.json();
    updateCartUI(data);
  }
}

async function removeFromCart(itemId) {
  const res = await fetch('/ajax/cart/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId })
  });

  if (res.ok) {
    const data = await res.json();
    updateCartUI(data);
  }
}

function updateCartUI(cart) {
  // تحديث واجهة السلة
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cart.totalQuantity;
  }
}
```
