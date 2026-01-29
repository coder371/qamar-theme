# Cart API

واجهة برمجية للتعامل مع سلة التسوق.

## Endpoints

| العملية | الطريقة | المسار |
|---------|---------|--------|
| الحصول على السلة | GET | `/ajax/cart` |
| إضافة منتج | POST | `/ajax/cart/add` |
| تحديث الكمية | POST | `/ajax/cart/change` |
| حذف عنصر | POST | `/ajax/cart/remove` |
| مسح السلة | POST | `/ajax/cart/clear` |

---

## بنية الاستجابة (Response)

جميع الـ endpoints ترجع نفس البنية:

```json
{
  "success": true,
  "couponApplied": false,
  "couponDiscount": 0,
  "totalCompareAtPrice": 1470000,
  "totalPrice": 244500,
  "totalSavings": 1225500,
  "totalQuantity": 27,
  "items": [
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
  ]
}
```

### حقول الاستجابة

| الحقل | النوع | الوصف |
|-------|------|-------|
| `success` | boolean | نجاح العملية |
| `totalQuantity` | number | إجمالي عدد القطع |
| `totalPrice` | number | إجمالي السعر |
| `totalCompareAtPrice` | number | إجمالي السعر قبل الخصم |
| `totalSavings` | number | إجمالي التوفير |
| `items` | array | قائمة العناصر |

### حقول العنصر (Item)

| الحقل | النوع | الوصف |
|-------|------|-------|
| `_id` | string | معرّف العنصر في السلة |
| `productId` | string | معرّف المنتج |
| `variantId` | string/null | معرّف المتغير |
| `quantity` | number | الكمية |
| `price` | number | سعر الوحدة |
| `totalPrice` | number | السعر الإجمالي للعنصر |
| `compareAtPrice` | number | سعر المقارنة للوحدة |
| `productData` | object | بيانات المنتج |

---

## الحصول على السلة

```javascript
GET /ajax/cart
```

**مثال:**
```javascript
const res = await fetch('/ajax/cart');
const cart = await res.json();
```

---

## إضافة منتج

```javascript
POST /ajax/cart/add
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `productId` | string | معرّف المنتج (مطلوب) |
| `variantId` | string | معرّف المتغير (اختياري) |
| `quantity` | number | الكمية (افتراضي: 1) |

**مثال:**
```javascript
const res = await fetch('/ajax/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product123',
    quantity: 2,
    variantId: 'variant456' // اختياري
  })
});
const cart = await res.json();
```

---

## تحديث الكمية

```javascript
POST /ajax/cart/change
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `itemId` | string | معرّف العنصر في السلة |
| `quantity` | number | الكمية الجديدة |

**مثال:**
```javascript
const res = await fetch('/ajax/cart/change', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ itemId: 'item123', quantity: 3 })
});
const cart = await res.json();
```

---

## حذف عنصر

```javascript
POST /ajax/cart/remove
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `itemId` | string | معرّف العنصر |

**مثال:**
```javascript
const res = await fetch('/ajax/cart/remove', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ itemId: 'item123' })
});
const cart = await res.json();
```

---

## مسح السلة

```javascript
POST /ajax/cart/clear
```

**مثال:**
```javascript
const res = await fetch('/ajax/cart/clear', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
const cart = await res.json();
```

---

## استخدام CartManager

الكود الموجود في `assets/main.js` يوفر واجهة سهلة:

```javascript
// إضافة منتج
await CartManager.add('productId', 1, 'variantId');

// زيادة الكمية
await CartManager.increment('itemId', currentQty);

// تقليل الكمية
await CartManager.decrement('itemId', currentQty);

// تحديث الكمية
await CartManager.update('itemId', 5);

// حذف عنصر
await CartManager.remove('itemId');

// تفريغ السلة
await CartManager.clear();
```

---

## أحداث مخصصة

عند تحديث السلة، يتم إرسال حدث مخصص:

```javascript
window.addEventListener('cart:updated', (e) => {
  console.log('Cart updated:', e.detail);
  // e.detail = بيانات السلة الكاملة
});
```

---

## استخدام في القوالب (Nunjucks)

### عرض عدد القطع

```html
<span data-cart-count>{{ cart.totalQuantity }}</span>
```

### عرض عدد المنتجات المختلفة

```html
<span data-cart-items-count>{{ cart.items | length }}</span>
```

### عرض المجموع

```html
<span data-cart-total>{{ cart.totalPrice | money }}</span>
```

### زر الإضافة للسلة

```html
<button onclick="CartManager.add('{{ product._id }}')">
  أضف للسلة
</button>

<!-- مع الكمية والمتغير -->
<button onclick="CartManager.add('{{ product._id }}', 2, '{{ variant._id }}')">
  أضف للسلة
</button>
```

### أزرار التحكم بالكمية

```html
<button onclick="CartManager.decrement('{{ item._id }}', {{ item.quantity }})">-</button>
<span data-item-qty="{{ item._id }}">{{ item.quantity }}</span>
<button onclick="CartManager.increment('{{ item._id }}', {{ item.quantity }})">+</button>
```

### زر الحذف

```html
<button onclick="CartManager.remove('{{ item._id }}')">
  حذف
</button>
```

### زر تفريغ السلة

```html
<button onclick="CartManager.clear()">
  تفريغ السلة
</button>
```
