# المتغيرات في Nunjucks

المتغيرات الرئيسية المتاحة في قوالب Nunjucks.

---

## 1. `store` - بيانات المتجر

```nunjucks
{{ store._id }}                               {# معرف المتجر #}
{{ store.name }}                              {# اسم المتجر #}
{{ store.subdomain }}                         {# الدومين الفرعي #}
{{ store.description }}                       {# وصف المتجر #}
{{ store.url }}                               {# رابط المتجر الكامل #}
{{ store.mode }}                              {# وضع المتجر (development/production) #}
{{ store.active }}                            {# هل المتجر نشط؟ #}
```

### الشعار

```nunjucks
{{ store.logo.fileUrl }}                      {# رابط الشعار #}
{{ store.logo.file }}                         {# اسم ملف الشعار #}
```

---

## 2. `cart` - بيانات السلة

> **ملاحظة**: الأسعار بالوحدة الصغرى (مثل الهللة). قيمة `244500` تعني `2445.00` ريال.

```nunjucks
{{ cart.totalQuantity }}                      {# إجمالي عدد القطع #}
{{ cart.totalPrice }}                         {# إجمالي السعر #}
{{ cart.totalCompareAtPrice }}                {# إجمالي السعر قبل الخصم #}
{{ cart.totalSavings }}                       {# إجمالي التوفير #}
{{ cart.couponApplied }}                      {# هل يوجد كوبون مطبق؟ (true/false) #}
{{ cart.couponDiscount }}                     {# قيمة خصم الكوبون #}
{{ cart.items | length }}                     {# عدد المنتجات المختلفة #}
```

### مثال على بنية السلة الكاملة

```json
{
  "success": true,
  "couponApplied": false,
  "couponDiscount": 0,
  "totalCompareAtPrice": 1470000,
  "totalPrice": 244500,
  "totalSavings": 1225500,
  "totalQuantity": 27,
  "items": [...]
}
```

### عناصر السلة

```nunjucks
{% for item in cart.items %}
  {{ item._id }}                              {# معرف العنصر في السلة (للتعديل/الحذف) #}
  {{ item.productId }}                        {# معرف المنتج #}
  {{ item.variantId }}                        {# معرف المتغير (null إذا لم يوجد) #}
  {{ item.quantity }}                         {# الكمية #}
  {{ item.price }}                            {# سعر الوحدة #}
  {{ item.compareAtPrice }}                   {# سعر المقارنة للوحدة #}
  {{ item.totalPrice }}                       {# السعر الإجمالي (السعر × الكمية) #}
  {{ item.totalCompareAtPrice }}              {# إجمالي سعر المقارنة #}
  {{ item.totalSavings }}                     {# التوفير لهذا العنصر #}
{% endfor %}
```

### بيانات المنتج في السلة (productData)

```nunjucks
{% for item in cart.items %}
  {{ item.productData.title }}                {# اسم المنتج #}
  {{ item.productData.handle }}               {# handle المنتج للرابط #}
  {{ item.productData.image.fileUrl }}        {# رابط صورة المنتج #}
  {{ item.productData.image._id }}            {# معرف الصورة #}
{% endfor %}
```

### مثال على عنصر سلة

```json
{
  "_id": "69729a063a0a43c10261b2a6",
  "productId": "696fa9251e3817d435c34b9d",
  "variantId": null,
  "quantity": 7,
  "totalCompareAtPrice": 140000,
  "compareAtPrice": 20000,
  "totalPrice": 108500,
  "price": 15500,
  "totalSavings": 31500,
  "productData": {
    "title": "اسم المنتج",
    "handle": "product-handle",
    "image": {
      "_id": "696fa9441e3817d435c34bfb",
      "fileUrl": "https://cdn.qumra.cloud/..."
    }
  }
}
```

### مثال عملي لعرض السلة

```nunjucks
{% if cart.items | length > 0 %}
  {% for item in cart.items %}
    <div class="cart-item">
      <img src="{{ item.productData.image.fileUrl }}" alt="{{ item.productData.title }}">
      <a href="/products/{{ item.productData.handle }}">
        {{ item.productData.title }}
      </a>
      <span>{{ item.price | money }} × {{ item.quantity }}</span>
      <span>{{ item.totalPrice | money }}</span>
    </div>
  {% endfor %}

  <div class="cart-total">
    <span>المجموع: {{ cart.totalPrice | money }}</span>
    <span>عدد القطع: {{ cart.totalQuantity }}</span>
  </div>
{% else %}
  <p>السلة فارغة</p>
{% endif %}
```

---

## 3. `wishlist` - بيانات المفضلة

```nunjucks
{{ wishlist.success }}                        {# هل تم جلب البيانات بنجاح؟ #}
{{ wishlist.count }}                          {# عدد المنتجات في المفضلة #}
```

### منتجات المفضلة

```nunjucks
{% for product in wishlist.products %}
  {{ product._id }}                           {# معرف المنتج #}
  {{ product.title }}                         {# اسم المنتج #}
  {{ product.description }}                   {# وصف المنتج (HTML) #}
  {{ product.quantity }}                      {# الكمية المتاحة #}
  {{ product.averageRating }}                 {# متوسط التقييم #}
  {{ product.reviewsCount }}                  {# عدد المراجعات #}
  {{ product.createdAt }}                     {# تاريخ الإنشاء #}

  {# الصور #}
  {% for image in product.images %}
    {{ image.fileUrl }}                       {# رابط الصورة #}
    {{ image._id }}                           {# معرف الصورة #}
  {% endfor %}

  {# التسعير #}
  {{ product.pricing.price }}                 {# السعر #}
  {{ product.pricing.compareAtPrice }}        {# السعر قبل الخصم #}
{% endfor %}
```

---

## 4. `localization` - بيانات الترجمة والعملة

```nunjucks
{{ localization.language }}                   {# اللغة الحالية (ar, en, fr) #}
{{ localization.availableLanguages }}         {# مصفوفة اللغات المتاحة #}
```

### العملة

```nunjucks
{{ localization.currency._id }}               {# معرف العملة #}
{{ localization.currency.title }}             {# اسم العملة #}
{{ localization.currency.currencyCode }}      {# كود العملة (SAR, USD) #}
{{ localization.currency.currencySymbol }}    {# رمز العملة (ر.س, $) #}
```

### السوق (Market)

```nunjucks
{{ localization.market.exchangeRate }}        {# سعر الصرف #}
{{ localization.market.targetCurrencyCode }}  {# كود العملة المستهدفة #}
{{ localization.market.isDefault }}           {# هل هو السوق الافتراضي؟ #}
{{ localization.market.fxMode }}              {# وضع الصرف (manual/auto) #}
{{ localization.market.enableRounding }}      {# تفعيل التقريب #}
```

---

## 5. `widget.data` - بيانات الويدجت

داخل ملف الويدجت، يمكنك الوصول للإعدادات المعرّفة في `schema.json`:

```nunjucks
{{ widget.data.title }}                       {# قيمة إعداد title #}
{{ widget.data.show_button }}                 {# قيمة إعداد show_button #}
{{ widget.data.background_color }}            {# قيمة إعداد background_color #}

{# للقوائم #}
{% for item in widget.data.main_menu %}
  {{ item.title }}
  {{ item.url }}
{% endfor %}
```

---

## 6. `widget.blocks` - بلوكات الويدجت

للويدجات التي تحتوي على blocks (مثل السلايدر):

```nunjucks
{% set blocks = widget.blocks | default([]) %}

{% for block in blocks %}
  {{ block.settings.title }}
  {{ block.settings.image }}
  {{ block.settings.link }}
{% endfor %}
```

> **تنبيه**: دائماً استخدم `| default([])` لتجنب أخطاء إذا كان `widget.blocks` غير معرّف.

---

## 7. `settings` - إعدادات الثيم

الإعدادات المعرّفة في `settings/settings-schema.json`:

```nunjucks
{{ settings.primary_color }}
{{ settings.secondary_color }}
{{ settings.font_family }}
{{ settings.logo_height }}
```

---

## 8. `page` - بيانات الصفحة الحالية

```nunjucks
{{ page.title }}                              {# عنوان الصفحة #}
{{ page.type }}                               {# نوع الصفحة #}
{{ page.url }}                                {# رابط الصفحة #}
```

---

## 9. `product` - بيانات المنتج (في صفحة المنتج)

```nunjucks
{{ product._id }}                             {# معرف المنتج #}
{{ product.title }}                           {# اسم المنتج #}
{{ product.handle }}                          {# handle للرابط #}
{{ product.description }}                     {# الوصف (HTML) #}
{{ product.quantity }}                        {# الكمية المتاحة #}
{{ product.sku }}                             {# SKU #}

{# التسعير #}
{{ product.pricing.price | money }}
{{ product.pricing.compareAtPrice | money }}

{# الصور #}
{% for image in product.images %}
  {{ image.fileUrl }}
{% endfor %}

{# الخيارات #}
{% for option in product.options %}
  {{ option.name }}                           {# اسم الخيار (اللون، المقاس) #}
  {% for value in option.values %}
    {{ value.label }}                         {# قيمة الخيار #}
  {% endfor %}
{% endfor %}

{# المتغيرات #}
{% for variant in product.variants %}
  {{ variant._id }}
  {{ variant.sku }}
  {{ variant.price }}
  {{ variant.quantity }}
{% endfor %}
```

---

## 10. `collection` - بيانات التصنيف (في صفحة التصنيف)

```nunjucks
{{ collection._id }}
{{ collection.title }}
{{ collection.handle }}
{{ collection.description }}
{{ collection.image.fileUrl }}

{# منتجات التصنيف #}
{% for product in collection.products %}
  {{ product.title }}
  {{ product.pricing.price | money }}
{% endfor %}
```

---

## ملاحظات هامة

### 1. الأسعار بالوحدة الصغرى

جميع الأسعار في الـ API تُرجع بالوحدة الصغرى (هللة/سنت):
- `244500` = `2445.00` ريال
- `15500` = `155.00` ريال

استخدم فلتر `| money` لعرض السعر بشكل صحيح:
```nunjucks
{{ cart.totalPrice | money }}  {# يعرض: 2,445.00 ر.س #}
```

### 2. التحقق من وجود القيم

دائماً تحقق من وجود القيم قبل استخدامها:
```nunjucks
{{ item.productData.handle | default(item.productId) }}
{{ product.pricing.compareAtPrice | default(0) }}
{% if cart.items | length > 0 %}...{% endif %}
```

### 3. الفرق بين `_id` و `handle`

- `_id`: معرف داخلي يُستخدم مع الـ API
- `handle`: نص URL-friendly يُستخدم في الروابط

```nunjucks
{# للروابط #}
<a href="/products/{{ product.handle }}">

{# للـ API #}
<button onclick="CartManager.add('{{ product._id }}')">
```
