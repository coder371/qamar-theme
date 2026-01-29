# مكتبات الفرونت إند

> **مهم**: جميع مكتبات الفرونت إند يجب استدعاؤها **يدوياً** في الـ Layout. لا يتم تضمينها تلقائياً.

---

## قائمة المكتبات

| المكتبة | النوع | الاستخدام | مطلوب |
|---------|-------|-----------|-------|
| Google Fonts | CSS | الخطوط | نعم |
| Tailwind CSS | CSS/JS | التنسيق | نعم |
| Alpine.js | JS | التفاعل | نعم |
| Swiper.js | CSS/JS | السلايدرات | نعم |
| GLightbox | CSS/JS | معرض الصور | اختياري |
| Animate.css | CSS | الحركات | اختياري |

---

## 1. Google Fonts

> يجب تحميل الخطوط **أولاً** قبل أي مكتبة أخرى.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### تطبيق الخطوط في CSS

```css
/* الخط الافتراضي - عربي */
* {
  font-family: 'Tajawal', sans-serif !important;
}

/* الخط الإنجليزي */
html[lang="en"] *,
html[dir="ltr"] * {
  font-family: 'Poppins', sans-serif !important;
}
```

### خطوط عربية بديلة

| الخط | الوصف |
|------|-------|
| Tajawal | حديث ونظيف |
| Cairo | واضح وقابل للقراءة |
| Almarai | عصري |
| IBM Plex Sans Arabic | احترافي |

---

## 2. Tailwind CSS

```html
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
          sans: ['Tajawal', 'sans-serif'],
          arabic: ['Tajawal', 'sans-serif'],
          english: ['Poppins', 'sans-serif'],
        }
      }
    }
  }
</script>
```

### CSS Variables

```css
:root {
  --color-primary: #9C27B0;
  --color-primary-light: #CE93D8;
  --color-primary-dark: #7B1FA2;
  --color-secondary: #F48FB1;
  --color-surface: #FAFAFA;
  --color-background: #FFFFFF;
  --color-text: #212121;
  --color-border: #E0E0E0;
}
```

---

## 3. Alpine.js

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Alpine App Function

يجب تعريف function للـ Alpine في الـ body:

```html
<body x-data="qumraApp()">
```

```javascript
function qumraApp() {
  return {
    // Modal State
    modal: {
      open: false,
      type: null
    },

    // Search
    search: '',

    // Toggle Modal
    toggleModal(type) {
      if (this.modal.open && this.modal.type === type) {
        this.closeModal();
      } else {
        this.modal.open = true;
        this.modal.type = type;
        document.body.style.overflow = 'hidden';
      }
    },

    // Close Modal
    closeModal() {
      this.modal.open = false;
      this.modal.type = null;
      document.body.style.overflow = '';
    },

    // Search
    setSearch(query) {
      if (query && query.trim()) {
        window.location.href = '/search?q=' + encodeURIComponent(query.trim());
      }
    },

    init() {
      console.log('Theme initialized');
    }
  }
}
```

### استخدام Alpine في القوالب

```html
<!-- فتح Modal -->
<button @click="toggleModal('cart')">السلة</button>
<button @click="toggleModal('search')">بحث</button>
<button @click="toggleModal('sidebar')">القائمة</button>

<!-- إغلاق Modal -->
<button @click="closeModal()">إغلاق</button>

<!-- عرض Modal -->
<div x-show="modal.open && modal.type === 'cart'">
  محتوى السلة
</div>

<!-- البحث -->
<input x-model="search" @keydown.enter="setSearch(search)">
```

---

## 4. Swiper.js

```html
<!-- CSS في head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<!-- JS في body -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

### استخدام Swiper

```html
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>

<script>
  new Swiper('.mySwiper', {
    loop: true,
    autoplay: { delay: 5000 },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
</script>
```

---

## 5. GLightbox

```html
<!-- CSS في head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">

<!-- JS في body -->
<script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>
<script>
  GLightbox({ selector: '.glightbox' });
</script>
```

### استخدام GLightbox

```html
<a href="image-large.jpg" class="glightbox">
  <img src="image-thumb.jpg" alt="صورة">
</a>
```

---

## 6. Animate.css

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">
```

### استخدام Animate.css

```html
<div class="animate__animated animate__fadeIn">
  محتوى متحرك
</div>

<div class="animate__animated animate__slideInUp animate__delay-1s">
  محتوى مع تأخير
</div>
```

---

## ترتيب التحميل الصحيح

### في `<head>`:

```html
<head>
  <!-- 1. Meta Tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 2. Google Fonts (أولاً!) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal&family=Poppins&display=swap" rel="stylesheet">

  <!-- 3. SEO & Qumra -->
  {% seo %}
  {% qumra_head %}

  <!-- 4. Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- 5. CSS Libraries -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">

  <!-- 6. Custom CSS -->
  <style>/* CSS Variables & Font Rules */</style>
  <link rel="stylesheet" href="{{ 'style.css' | assets }}">
</head>
```

### في `<body>`:

```html
<body x-data="qumraApp()">
  <!-- Content -->

  <!-- 1. Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <!-- 2. JS Libraries -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>

  <!-- 3. Qumra Scripts -->
  {% qumra_scripts %}

  <!-- 4. Custom JS -->
  <script src="{{ 'main.js' | assets }}"></script>

  <!-- 5. Initialize -->
  <script>
    function qumraApp() { /* ... */ }
    GLightbox({ selector: '.glightbox' });
  </script>
</body>
```

---

## ملاحظات مهمة

1. **الخطوط أولاً** - يجب تحميل Google Fonts قبل Tailwind
2. **`!important`** - استخدمه للخطوط لتجاوز Tailwind
3. **Alpine قبل qumra_scripts** - لضمان عمل x-data
4. **defer في Alpine** - يمنع blocking للصفحة
