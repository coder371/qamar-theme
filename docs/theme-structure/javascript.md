# JavaScript Architecture

ملف `assets/main.js` يحتوي على بنية JavaScript قابلة للتوسع.

---

## Architecture Overview

```
Qumra (Main Namespace)
├── config      → QumraConfig (إعدادات مركزية)
├── events      → EventBus (نظام الأحداث)
├── api         → ApiClient (HTTP Client)
├── cart        → CartManager
├── wishlist    → WishlistManager
├── search      → SearchManager
├── product     → ProductManager
├── modal       → ModalController
├── utils       → Utils (دوال مساعدة)
└── toast       → Toast (الإشعارات)
```

---

## QumraConfig - الإعدادات المركزية

جميع الإعدادات في مكان واحد:

```javascript
QumraConfig.api.cart.add           // '/ajax/cart/add'
QumraConfig.defaults.currency       // from localization.currency.currencyCode
QumraConfig.defaults.currencySymbol // from localization.currency.currencySymbol
QumraConfig.defaults.language       // from localization.language
QumraConfig.messages.cart.added     // 'تمت الإضافة إلى السلة'
QumraConfig.selectors.cart.count    // '[data-cart-count]'
```

### تعديل الرسائل

```javascript
// تغيير رسالة
QumraConfig.messages.cart.added = 'Added to cart';
```

> ملاحظة: إعدادات العملة تأتي تلقائياً من `localization` في الـ layout

---

## EventBus - نظام الأحداث

نظام أحداث مركزي للتواصل بين المكونات:

```javascript
// الاشتراك في حدث
EventBus.on('cart:updated', (cart) => {
  console.log('Cart updated:', cart);
});

// إلغاء الاشتراك
const unsubscribe = EventBus.on('cart:updated', callback);
unsubscribe(); // إلغاء

// إطلاق حدث
EventBus.emit('custom:event', { data: 'value' });
```

### الأحداث المتاحة

| الحدث | البيانات |
|-------|---------|
| `cart:updated` | بيانات السلة الكاملة |
| `wishlist:updated` | بيانات المفضلة |
| `modal:open` | `{ name }` |
| `modal:close` | `{ name }` |

---

## ApiClient - HTTP Client

```javascript
// GET request
const data = await ApiClient.get('/ajax/cart');

// GET with params
const results = await ApiClient.get('/ajax/search', { q: 'query', limit: 10 });

// POST request
const result = await ApiClient.post('/ajax/cart/add', { productId: '123' });
```

---

## CartManager

### الدوال

```javascript
// جلب السلة
const cart = await Qumra.cart.get();

// إضافة منتج
await Qumra.cart.add(productId, quantity, variantId);

// تحديث الكمية
await Qumra.cart.update(itemId, quantity);

// زيادة/تقليل الكمية (يقرأ الكمية الحالية من DOM تلقائياً)
await Qumra.cart.increment(itemId);
await Qumra.cart.decrement(itemId);

// حذف عنصر
await Qumra.cart.remove(itemId);

// تفريغ السلة
await Qumra.cart.clear();

// تنسيق السعر (أرقام إنجليزية دائماً)
Qumra.cart.formatMoney(2445); // "2,445.00 ر.س"
```

### الاستجابة

```javascript
{
  success: true,
  totalQuantity: 5,
  totalPrice: 150000,
  items: [
    {
      _id: "itemId",
      productId: "productId",
      quantity: 2,
      price: 50000,
      totalPrice: 100000,
      productData: {
        title: "اسم المنتج",
        handle: "product-handle",
        image: { fileUrl: "..." }
      }
    }
  ]
}
```

---

## WishlistManager

```javascript
// إضافة للمفضلة
await Qumra.wishlist.add(productId);

// حذف من المفضلة
await Qumra.wishlist.remove(productId);

// تبديل (إضافة/حذف)
await Qumra.wishlist.toggle(productId);

// مسح المفضلة
await Qumra.wishlist.clear();
```

---

## SearchManager

```javascript
// بحث
const results = await Qumra.search.search(query, { limit: 10 });

// اقتراحات مع debounce
Qumra.search.suggest(query, (suggestions) => {
  console.log(suggestions);
}, 300);

// debounce عام
const debouncedFn = Qumra.search.debounce(myFunction, 300);
```

---

## ProductManager

```javascript
// جلب منتج
const product = await Qumra.product.get(productId);

// تحديد المتغير
const variant = await Qumra.product.getVariant(productId, selectedOptions);
```

---

## ModalController

```javascript
// فتح modal
Qumra.modal.open('cart');
Qumra.modal.open('search');

// إغلاق
Qumra.modal.close();

// تبديل
Qumra.modal.toggle('cart');

// الحالي
console.log(Qumra.modal.current); // 'cart' or null
```

---

## Toast Notifications

```javascript
Qumra.toast.success('تمت العملية بنجاح');
Qumra.toast.error('حدث خطأ');
Qumra.toast.warning('تنبيه');
Qumra.toast.info('معلومة');

// مع مدة مخصصة
Qumra.toast.success('رسالة', 5000); // 5 ثواني
```

---

## Utils - دوال مساعدة

```javascript
// تنسيق السعر
Qumra.utils.formatMoney(2445);  // "2,445.00 ر.س" (uses localization.currency.currencySymbol)

// حساب نسبة الخصم
Qumra.utils.calcDiscount(150, 200);     // 25

// debounce
const debouncedFn = Qumra.utils.debounce(fn, 300);

// throttle
const throttledFn = Qumra.utils.throttle(fn, 100);

// تحميل الصور الكسول
Qumra.utils.lazyLoadImages();
```

---

## Data Attributes

### السلة

```html
<!-- عدد القطع -->
<span data-cart-count>0</span>

<!-- عدد المنتجات المختلفة -->
<span data-cart-items-count>0</span>

<!-- إجمالي السعر -->
<span data-cart-total>0</span>

<!-- عنصر سلة (للحذف والتحديث) -->
<div data-cart-item="itemId">...</div>

<!-- كمية عنصر -->
<span data-item-qty="itemId">1</span>

<!-- إجمالي عنصر -->
<span data-item-total="itemId">0</span>

<!-- حاوية السلة -->
<div data-cart-container>...</div>
```

### المفضلة

```html
<!-- عداد المفضلة -->
<span data-wishlist-count>0</span>

<!-- زر المفضلة -->
<button data-wishlist-btn="productId">♡</button>
```

---

## Alpine.js Integration

### Alpine Stores

```javascript
// الوصول للـ stores
Alpine.store('cart').items
Alpine.store('cart').totalQuantity
Alpine.store('wishlist').count
Alpine.store('modal').current
```

### استخدام في القوالب

```html
<body x-data="app()">
  <!-- فتح السلة -->
  <button @click="$store.modal.toggle('cart')">السلة</button>

  <!-- إغلاق أي modal -->
  <button @click="$store.modal.close()">إغلاق</button>

  <!-- التحقق من modal مفتوح -->
  <div x-show="$store.modal.current === 'cart'">
    محتوى السلة
  </div>
</body>
```

---

## استخدام في Nunjucks

### أزرار السلة

```nunjucks
{# إضافة للسلة #}
<button onclick="Qumra.cart.add('{{ product._id }}')">
  أضف للسلة
</button>

{# إضافة مع كمية #}
<button onclick="Qumra.cart.add('{{ product._id }}', 3)">
  أضف 3 قطع
</button>

{# إضافة مع متغير #}
<button onclick="Qumra.cart.add('{{ product._id }}', 1, '{{ variant._id }}')">
  أضف للسلة
</button>
```

### التحكم بالكمية

```nunjucks
{% for item in cart.items %}
  <div data-cart-item="{{ item._id }}">
    <button onclick="Qumra.cart.decrement('{{ item._id }}')">
      -
    </button>
    <!-- data-item-qty مهم: يُستخدم لقراءة الكمية الحالية -->
    <span data-item-qty="{{ item._id }}">{{ item.quantity }}</span>
    <button onclick="Qumra.cart.increment('{{ item._id }}')">
      +
    </button>
  </div>
{% endfor %}
```

### زر المفضلة

```nunjucks
<button
  onclick="Qumra.wishlist.toggle('{{ product._id }}')"
  data-wishlist-btn="{{ product._id }}"
  class="{% if product._id in wishlist.productIds %}active{% endif %}">
  ♡
</button>
```

---

## Backward Compatibility

الدوال القديمة لا تزال تعمل:

```javascript
// قديم (لا يزال يعمل)
CartManager.add(productId);
WishlistManager.toggle(productId);
toggleModal('cart');
formatMoney(100);

// جديد (مفضل)
Qumra.cart.add(productId);
Qumra.wishlist.toggle(productId);
Qumra.modal.toggle('cart');
Qumra.utils.formatMoney(100);
```

---

## إضافة Manager جديد

```javascript
const MyManager = BaseManager.create({
  async doSomething(id) {
    return this._execute(
      () => ApiClient.post('/ajax/my-endpoint', { id }),
      {
        loadingSelector: `[data-my-item="${id}"]`,
        successMessage: 'تم بنجاح',
        onSuccess: (data) => {
          EventBus.emit('my:updated', data);
        }
      }
    );
  }
});

// إضافة للـ namespace
Qumra.my = MyManager;
window.MyManager = MyManager;
```

---

## CSS Classes للحالات

```css
/* حالة التحميل */
.loading { opacity: 0.6; pointer-events: none; }

/* حالة نشط (مفضلة) */
.active { color: red; }

/* حالة الحذف */
.removing { transform: translateX(-100%); opacity: 0; }
```
