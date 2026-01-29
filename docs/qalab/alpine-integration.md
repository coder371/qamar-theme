# تكامل Alpine.js

كيفية استخدام Alpine.js مع قوالب Nunjucks في ثيمات قمرة.

---

## الفرق بين Nunjucks و Alpine.js

| | Nunjucks | Alpine.js |
|--|----------|-----------|
| **التنفيذ** | Server-side | Client-side |
| **الوقت** | عند تحميل الصفحة | بعد تحميل الصفحة |
| **البيانات** | من قمرة (store, cart, etc.) | من JavaScript |
| **التفاعل** | لا | نعم |

---

## القاعدة الأساسية

> **Nunjucks** للبيانات الثابتة، **Alpine.js** للتفاعل.

### صحيح:

```nunjucks
{# عدد السلة - بيانات من السيرفر #}
<span>{{ cart.items | length }}</span>

{# فتح/إغلاق - تفاعل #}
<button @click="toggleModal('cart')">السلة</button>
```

### خطأ:

```nunjucks
{# ❌ Alpine لا يستطيع الوصول لمتغيرات Nunjucks #}
<span x-text="cart.items.length"></span>

{# ❌ Nunjucks لا يستطيع التفاعل مع المستخدم #}
{% if modal.open %}...{% endif %}
```

---

## إعداد Alpine.js

### 1. تعريف App في body

```html
<body x-data="qumraApp()">
```

### 2. كتابة Function

```javascript
function qumraApp() {
  return {
    // State
    modal: { open: false, type: null },
    search: '',

    // Methods
    toggleModal(type) {
      if (this.modal.open && this.modal.type === type) {
        this.closeModal();
      } else {
        this.modal.open = true;
        this.modal.type = type;
      }
    },

    closeModal() {
      this.modal.open = false;
      this.modal.type = null;
    },

    setSearch(query) {
      window.location.href = '/search?q=' + encodeURIComponent(query);
    }
  }
}
```

---

## أنماط شائعة

### 1. Modal / Drawer

```nunjucks
{# زر الفتح #}
<button @click="toggleModal('cart')">
  السلة ({{ cart.items | length }})  {# Nunjucks للعدد #}
</button>

{# المحتوى #}
<div x-show="modal.open && modal.type === 'cart'" x-cloak>  {# Alpine للعرض/الإخفاء #}
  {% for item in cart.items %}  {# Nunjucks للبيانات #}
    <div>{{ item.productData.title }}</div>
  {% endfor %}

  <button @click="closeModal()">إغلاق</button>  {# Alpine للتفاعل #}
</div>
```

### 2. Tabs

```nunjucks
<div x-data="{ activeTab: 'description' }">
  {# أزرار التبويب #}
  <button @click="activeTab = 'description'" :class="activeTab === 'description' && 'active'">
    الوصف
  </button>
  <button @click="activeTab = 'reviews'" :class="activeTab === 'reviews' && 'active'">
    التقييمات
  </button>

  {# المحتوى #}
  <div x-show="activeTab === 'description'">
    {{ product.description | safe }}  {# بيانات من Nunjucks #}
  </div>
  <div x-show="activeTab === 'reviews'">
    {% for review in product.reviews %}
      <div>{{ review.content }}</div>
    {% endfor %}
  </div>
</div>
```

### 3. Quantity Input

```nunjucks
<div x-data="{ qty: 1 }">
  <button @click="qty > 1 && qty--">-</button>
  <input type="number" x-model="qty" min="1">
  <button @click="qty++">+</button>

  <button @click="CartManager.add('{{ product._id }}', qty)">
    أضف للسلة
  </button>
</div>
```

### 4. Accordion

```nunjucks
<div x-data="{ open: null }">
  {% for item in widget.blocks %}
    <div>
      <button @click="open = open === {{ loop.index0 }} ? null : {{ loop.index0 }}">
        {{ item.settings.title }}
      </button>
      <div x-show="open === {{ loop.index0 }}" x-collapse>
        {{ item.settings.content | safe }}
      </div>
    </div>
  {% endfor %}
</div>
```

### 5. Image Gallery

```nunjucks
<div x-data="{ current: 0 }">
  {# الصورة الرئيسية #}
  {% for image in product.images %}
    <img
      x-show="current === {{ loop.index0 }}"
      src="{{ image.fileUrl }}"
      alt="{{ product.title }}">
  {% endfor %}

  {# المصغرات #}
  <div class="flex gap-2">
    {% for image in product.images %}
      <button @click="current = {{ loop.index0 }}">
        <img src="{{ image.fileUrl }}" class="w-16 h-16 object-cover">
      </button>
    {% endfor %}
  </div>
</div>
```

---

## x-cloak

منع ظهور العناصر قبل تحميل Alpine:

```html
<style>
  [x-cloak] { display: none !important; }
</style>

<div x-cloak x-show="modal.open">
  لن يظهر حتى يُحمّل Alpine
</div>
```

---

## تمرير بيانات من Nunjucks لـ Alpine

### باستخدام JSON

```nunjucks
<div x-data='{ products: {{ products | dump | safe }} }'>
  <template x-for="product in products">
    <div x-text="product.title"></div>
  </template>
</div>
```

### باستخدام data attributes

```nunjucks
<button
  data-product-id="{{ product._id }}"
  @click="addToCart($el.dataset.productId)">
  أضف للسلة
</button>
```

---

## أخطاء شائعة

### 1. استخدام متغيرات Nunjucks في Alpine expressions

```nunjucks
{# ❌ خطأ #}
<span x-text="cart.totalPrice"></span>

{# ✅ صحيح #}
<span>{{ cart.totalPrice | money }}</span>
```

### 2. استخدام Alpine للبيانات الثابتة

```nunjucks
{# ❌ غير ضروري #}
<div x-data="{ title: '{{ product.title }}' }">
  <h1 x-text="title"></h1>
</div>

{# ✅ أبسط #}
<h1>{{ product.title }}</h1>
```

### 3. نسيان x-cloak

```nunjucks
{# ❌ سيظهر للحظة ثم يختفي #}
<div x-show="modal.open">...</div>

{# ✅ لن يظهر حتى يعمل Alpine #}
<div x-cloak x-show="modal.open">...</div>
```

---

## ملخص

| المهمة | استخدم |
|--------|--------|
| عرض بيانات المنتج/السلة/المتجر | Nunjucks `{{ }}` |
| الحلقات على البيانات | Nunjucks `{% for %}` |
| الشروط على البيانات | Nunjucks `{% if %}` |
| فتح/إغلاق عناصر | Alpine `@click`, `x-show` |
| تغيير الصور/التبويبات | Alpine `x-data`, `@click` |
| نماذج تفاعلية | Alpine `x-model` |
| Animations | Alpine `x-transition` |
