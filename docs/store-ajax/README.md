# Store AJAX API

واجهة برمجية جانب العميل للتعامل مع المتجر.

## المحتويات

| الملف | المحتوى |
|-------|---------|
| [cart.md](./cart.md) | Cart API - السلة |
| [wishlist.md](./wishlist.md) | Wishlist API - المفضلة |
| [search.md](./search.md) | Search API - البحث |
| [product.md](./product.md) | Product API - المنتج |

---

## نظرة عامة

Store AJAX يوفر endpoints للتعامل مع:
- **السلة** - إضافة، حذف، تحديث، مسح
- **المفضلة** - إضافة، حذف، مسح
- **البحث** - بحث المنتجات، اقتراحات
- **المنتج** - جلب بيانات، تحديد المتغير

---

## الاستخدام العام

جميع الطلبات تستخدم:
- **Content-Type**: `application/json`
- **Method**: `GET` أو `POST` حسب العملية
- **الأسعار**: بالوحدة الصغرى (هللة/سنت)

```javascript
const res = await fetch('/ajax/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: '...' })
});
const data = await res.json();
```

---

## ملخص Endpoints

### السلة (Cart)

| العملية | الطريقة | المسار |
|---------|---------|--------|
| الحصول على السلة | GET | `/ajax/cart` |
| إضافة للسلة | POST | `/ajax/cart/add` |
| تحديث الكمية | POST | `/ajax/cart/change` |
| حذف من السلة | POST | `/ajax/cart/remove` |
| مسح السلة | POST | `/ajax/cart/clear` |

### المفضلة (Wishlist)

| العملية | الطريقة | المسار |
|---------|---------|--------|
| إضافة للمفضلة | POST | `/ajax/wishlist/add` |
| حذف من المفضلة | POST | `/ajax/wishlist/remove` |
| مسح المفضلة | POST | `/ajax/wishlist/clear` |

### البحث (Search)

| العملية | الطريقة | المسار |
|---------|---------|--------|
| بحث المنتجات | GET | `/ajax/search/products` |
| اقتراحات البحث | GET | `/ajax/search/suggest` |

### المنتج (Product)

| العملية | الطريقة | المسار |
|---------|---------|--------|
| الحصول على منتج | GET | `/ajax/product` |
| تحديد المتغير | POST | `/ajax/product/resolve-variant-by-options` |

---

## Managers الجاهزة

في ملف `assets/main.js` يوجد managers جاهزة للاستخدام:

### CartManager

```javascript
// إضافة منتج
await CartManager.add(productId, quantity, variantId);

// زيادة الكمية
await CartManager.increment(itemId, currentQty);

// تقليل الكمية
await CartManager.decrement(itemId, currentQty);

// تحديث الكمية
await CartManager.update(itemId, newQty);

// حذف عنصر
await CartManager.remove(itemId);

// تفريغ السلة
await CartManager.clear();
```

### WishlistManager

```javascript
// إضافة للمفضلة
await WishlistManager.add(productId);

// حذف من المفضلة
await WishlistManager.remove(productId);

// تبديل (إضافة/حذف)
await WishlistManager.toggle(productId);

// مسح المفضلة
await WishlistManager.clear();
```

### SearchManager

```javascript
// بحث
const results = await SearchManager.search(query, { limit: 10 });

// اقتراحات مع debounce
SearchManager.suggest(query, (suggestions) => {
  console.log(suggestions);
}, 300);
```

### ProductManager

```javascript
// جلب منتج
const product = await ProductManager.get(productId);

// تحديد المتغير
const variant = await ProductManager.getVariant(productId, selectedOptions);
```

---

## الأحداث المخصصة (Custom Events)

عند تحديث السلة أو المفضلة، يتم إرسال أحداث مخصصة:

```javascript
// السلة
window.addEventListener('cart:updated', (e) => {
  console.log('Cart:', e.detail);
  // e.detail = بيانات السلة الكاملة
});

// المفضلة
window.addEventListener('wishlist:updated', (e) => {
  console.log('Wishlist:', e.detail);
});
```

---

## Data Attributes للتحديث التلقائي

استخدم هذه الـ attributes لتحديث العناصر تلقائياً:

```html
<!-- عدد القطع في السلة -->
<span data-cart-count>0</span>

<!-- عدد المنتجات المختلفة -->
<span data-cart-items-count>0</span>

<!-- إجمالي السلة -->
<span data-cart-total>0</span>

<!-- كمية عنصر معين -->
<span data-item-qty="itemId">1</span>

<!-- إجمالي عنصر معين -->
<span data-item-total="itemId">0</span>

<!-- عدد المفضلة -->
<span data-wishlist-count>0</span>

<!-- زر المفضلة (يضاف له class 'active') -->
<button data-wishlist-btn="productId">♡</button>
```

---

## Toast Notifications

نظام إشعارات جاهز:

```javascript
Toast.success('تمت الإضافة بنجاح');
Toast.error('حدث خطأ');
Toast.warning('تنبيه');
Toast.info('معلومة');
```

---

## ملاحظات هامة

### 1. الأسعار بالوحدة الصغرى

```javascript
// السعر المُرجع: 244500
// السعر الفعلي: 2445.00 ريال

// للتحويل
const price = amount / 100;
```

### 2. الفرق بين `_id` و `itemId`

- `productId` / `product._id`: معرف المنتج - للإضافة للسلة
- `itemId` / `item._id`: معرف العنصر في السلة - للتعديل والحذف

```javascript
// إضافة للسلة (استخدم productId)
CartManager.add(product._id, 1);

// تعديل الكمية (استخدم itemId)
CartManager.update(item._id, 5);
```

### 3. التعامل مع الأخطاء

```javascript
const result = await CartManager.add(productId, quantity);

if (result && result.success !== false) {
  // نجاح
} else {
  // فشل - result.message يحتوي على رسالة الخطأ
}
```

### 4. تحديث الصفحة

بعض العمليات تتطلب تحديث الصفحة لعرض البيانات الجديدة بشكل كامل:

```javascript
// الحذف والتفريغ يعيدون تحميل الصفحة تلقائياً
await CartManager.remove(itemId);  // يحدث الصفحة إذا فرغت السلة
await CartManager.clear();         // يحدث الصفحة دائماً
```
