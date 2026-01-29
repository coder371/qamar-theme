# الـ Tags الأساسية

Tags قمرة الخاصة المتاحة في قوالب Nunjucks.

## `{% seo %}`

يدرج meta tags الخاصة بـ SEO تلقائياً.

```nunjucks
<head>
  {% seo %}
</head>
```

---

## `{% qumra_head %}`

يدرج موارد قمرة الأساسية في `<head>`.

> **مهم**: هذا التاج **لا يشمل** المكتبات التالية ويجب استدعاؤها يدوياً:
> - Tailwind CSS
> - Google Fonts
> - Swiper.js CSS
> - GLightbox CSS
> - Animate.css

```nunjucks
<head>
  {% seo %}
  {% qumra_head %}

  {# المكتبات يجب إضافتها يدوياً هنا #}
</head>
```

---

## `{% qumra_scripts %}`

يدرج سكربتات قمرة الأساسية.

> **مهم**: هذا التاج **لا يشمل** المكتبات التالية ويجب استدعاؤها يدوياً:
> - Alpine.js
> - Swiper.js
> - GLightbox

```nunjucks
<body>
  <!-- المحتوى -->

  {# المكتبات يجب إضافتها يدوياً قبل qumra_scripts #}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>

  {% qumra_scripts %}
</body>
```

---

## `{% template "name" %}`

يدرج قالب من مجلد `templates/`.

```nunjucks
<body>
  {% template "header" %}
  <main>
    <!-- المحتوى -->
  </main>
  {% template "footer" %}
</body>
```

---

## `{% content %}`

يعرض محتوى الصفحة (الويدجات المحددة في ملف الصفحة).

```nunjucks
<body>
  {% template "header" %}
  <main>
    {% content %}
  </main>
  {% template "footer" %}
</body>
```

---

## `{{t('key')}}` - الترجمات

يعرض نص مترجم من ملفات الترجمة في `locales/`.

```nunjucks
{# ✅ الصيغة الصحيحة #}
{{t('common.home')}}
{{t('product.add_to_cart')}}
{{t('cart.empty')}}

{# ❌ صيغة خاطئة - لا تستخدمها #}
{% t('common.home') %}
```

### أمثلة الاستخدام

```nunjucks
<h1>{{t('cart.title')}}</h1>

<button>{{t('product.add_to_cart')}}</button>

{% if cart.items.length == 0 %}
  <p>{{t('cart.empty')}}</p>
{% endif %}

<a href="/products">{{t('common.view_all')}}</a>
```

### مع المتغيرات

```nunjucks
{# في locales/ar.json: "items_count": "{{ count }} منتج" #}
{{t('cart.items_count', { count: cart.totalQuantity })}}
```

> ⚠️ **مهم**: استخدم `{{t('key')}}` (أقواس مزدوجة) وليس `{% t('key') %}` (أقواس نسبة مئوية)

---

## `{% ui "file.njk" %}`

يدرج مكون UI من مجلد `ui/`.

```nunjucks
{# إدراج بسيط #}
{% ui "sidebar.njk" %}
{% ui "search.njk" %}
{% ui "cart.njk" %}

{# إدراج مع تمرير بيانات #}
{% ui "sidebar.njk", menu=widget.data.header_menu %}
{% ui "product-card.njk", product=item %}
```

---

## Tags Nunjucks الأساسية

### `{% if %}` - الشروط

```nunjucks
{% if cart.totalQuantity > 0 %}
  <span>{{ cart.totalQuantity }} منتج</span>
{% else %}
  <span>السلة فارغة</span>
{% endif %}

{% if product.pricing.compareAtPrice > product.pricing.price %}
  <span class="sale">تخفيض!</span>
{% endif %}
```

### `{% for %}` - الحلقات

```nunjucks
{% for item in cart.items %}
  <div class="cart-item">
    {{ item.productData.title }}
  </div>
{% endfor %}

{# مع index #}
{% for product in wishlist.products %}
  <div>{{ loop.index }}. {{ product.title }}</div>
{% endfor %}

{# حالة المصفوفة الفارغة #}
{% for item in cart.items %}
  {{ item.productData.title }}
{% else %}
  <p>السلة فارغة</p>
{% endfor %}
```

### `{% set %}` - تعريف متغير

```nunjucks
{% set menuItems = widget.data.header_menu or [] %}
{% set hasDiscount = product.pricing.compareAtPrice > product.pricing.price %}
{% set totalItems = cart.items | length %}

{% if hasDiscount %}
  <span class="badge">خصم</span>
{% endif %}
```

---

## مثال كامل للتخطيط

```nunjucks
<!DOCTYPE html>
<html lang="{{ localization.language }}" dir="{% if localization.language == 'en' %}ltr{% else %}rtl{% endif %}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  {% seo %}
  {% qumra_head %}

  {# ========== CSS Libraries ========== #}

  {# Tailwind CSS #}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            surface: 'var(--color-surface)',
          }
        }
      }
    }
  </script>

  {# Google Fonts #}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">

  {# Swiper CSS #}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

  {# GLightbox CSS #}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">

  {# Animate.css (اختياري) #}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">

  {# CSS Variables #}
  <style>
    :root {
      --color-primary: {{ settings.primaryColor | default('#9C27B0') }};
      --color-secondary: {{ settings.secondaryColor | default('#F48FB1') }};
      --color-surface: {{ settings.surfaceColor | default('#FAFAFA') }};
    }
    body { font-family: 'Tajawal', sans-serif; }
  </style>

  <link rel="stylesheet" href="{{ 'style.css' | assets }}"/>
</head>
<body>
  {% template "header" %}

  <main>
    {% content %}
  </main>

  {% template "footer" %}

  {# مكونات UI #}
  {% ui "sidebar.njk" %}
  {% ui "search.njk" %}
  {% ui "cart.njk" %}

  {# ========== JavaScript Libraries ========== #}

  {# Alpine.js #}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  {# Swiper JS #}
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  {# GLightbox JS #}
  <script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>

  {% qumra_scripts %}
  <script src="{{ 'main.js' | assets }}"></script>

  {# Initialize Libraries #}
  <script>
    GLightbox({ selector: '.glightbox' });
  </script>
</body>
</html>
```
