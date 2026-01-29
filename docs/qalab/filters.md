# الفلاتر (Filters)

الفلاتر المتاحة في قوالب Nunjucks لتنسيق وتحويل البيانات.

## `| money` - عرض السعر مع العملة

يعرض السعر مع رمز العملة بشكل تلقائي.

```nunjucks
{# بدلاً من #}
{{ cart.totalPrice }} {{ localization.currency.currencySymbol }}

{# استخدم #}
{{ cart.totalPrice | money }}
```

### أمثلة

```nunjucks
{# سعر المنتج #}
{{ product.pricing.price | money }}

{# السعر قبل الخصم #}
{{ product.pricing.compareAtPrice | money }}

{# إجمالي السلة #}
{{ cart.totalPrice | money }}

{# سعر عنصر في السلة #}
{{ item.price | money }}

{# التوفير #}
{{ cart.totalSavings | money }}

{# سعر الوحدة × الكمية #}
{{ item.totalPrice | money }}
```

---

## `| default` - قيمة افتراضية

يعيد قيمة افتراضية إذا كانت القيمة الأصلية فارغة أو غير موجودة.

```nunjucks
{{ item.url | default('#') }}
{{ product.title | default('بدون اسم') }}
{{ product.description | default('لا يوجد وصف') }}
```

---

## `| assets` - رابط ملفات الأصول

يحوّل اسم الملف إلى رابط كامل من مجلد assets.

```nunjucks
{# CSS #}
<link rel="stylesheet" href="{{ 'style.css' | assets }}">

{# JavaScript #}
<script src="{{ 'main.js' | assets }}"></script>

{# صور #}
<img src="{{ 'images/logo.png' | assets }}" alt="Logo">
```

---

## فلاتر Nunjucks الأساسية

### `| length` - طول المصفوفة أو النص

```nunjucks
{{ cart.items | length }}                     {# عدد عناصر السلة #}
{{ product.title | length }}                  {# طول اسم المنتج #}
```

### `| upper` و `| lower` - تحويل الحروف

```nunjucks
{{ localization.language | upper }}           {# AR, EN, FR #}
{{ product.title | lower }}                   {# حروف صغيرة #}
```

### `| first` و `| last` - أول وآخر عنصر

```nunjucks
{{ product.images | first }}                  {# أول صورة #}
{{ cart.items | last }}                       {# آخر عنصر في السلة #}
```

### `| join` - دمج المصفوفة

```nunjucks
{{ localization.availableLanguages | join(', ') }}  {# ar, en, fr #}
```

### `| truncate` - اقتطاع النص

```nunjucks
{{ product.description | truncate(100) }}     {# أول 100 حرف #}
```

### `| safe` - عرض HTML بدون تهريب

```nunjucks
{{ product.description | safe }}              {# يعرض HTML كما هو #}
```

---

## أمثلة عملية

### بطاقة منتج مع السعر

```nunjucks
<div class="product-card">
  <img src="{{ product.images[0].fileUrl | default('/placeholder.jpg') }}"
       alt="{{ product.title }}">

  <h3>{{ product.title | truncate(50) }}</h3>

  <div class="price">
    {% if product.pricing.compareAtPrice > product.pricing.price %}
      <span class="old-price">{{ product.pricing.compareAtPrice | money }}</span>
      <span class="new-price">{{ product.pricing.price | money }}</span>
    {% else %}
      <span>{{ product.pricing.price | money }}</span>
    {% endif %}
  </div>
</div>
```

### عرض إجمالي السلة

```nunjucks
<div class="cart-total">
  <p>عدد المنتجات: {{ cart.items | length }}</p>
  <p>المجموع: {{ cart.totalPrice | money }}</p>

  {% if cart.totalSavings > 0 %}
    <p class="savings">وفرت: {{ cart.totalSavings | money }}</p>
  {% endif %}
</div>
```
