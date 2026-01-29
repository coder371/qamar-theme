# Product API

واجهة برمجية للتعامل مع بيانات المنتجات.

## Endpoints

| العملية | الطريقة | المسار |
|---------|---------|--------|
| الحصول على منتج | GET | `/ajax/product` |
| تحديد المتغير | POST | `/ajax/product/resolve-variant-by-options` |

---

## الحصول على منتج

```javascript
GET /ajax/product?handle=product-handle
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `handle` | string | معرّف المنتج (slug) |

**مثال:**
```javascript
async function getProduct(handle) {
  const res = await fetch(`/ajax/product?handle=${handle}`);
  return res.json();
}

// استخدام
const product = await getProduct('rolex-submariner');
```

**الاستجابة:**
```json
{
  "_id": "...",
  "title": "اسم المنتج",
  "description": "...",
  "images": [...],
  "pricing": {
    "price": 1500,
    "compareAtPrice": 2000
  },
  "options": [...],
  "variants": [...]
}
```

---

## تحديد المتغير حسب الخيارات

```javascript
POST /ajax/product/resolve-variant-by-options
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `productId` | string | معرّف المنتج |
| `options` | array | مصفوفة معرفات الخيارات المختارة |
| `quantity` | number | الكمية (افتراضي: 1) |

**مثال:**
```javascript
async function getVariant(productId, selectedOptions, quantity = 1) {
  const res = await fetch('/ajax/product/resolve-variant-by-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      options: selectedOptions,
      quantity
    })
  });
  return res.json();
}

// استخدام
const variant = await getVariant('product123', ['option1_id', 'option2_id']);
```

**الاستجابة:**
```json
{
  "_id": "variant123",
  "sku": "SKU-001",
  "price": 1500,
  "compareAtPrice": 2000,
  "quantity": 10,
  "options": [...]
}
```

---

## مثال كامل - Product Manager

```javascript
const ProductManager = {
  cache: {},

  async get(handle) {
    // التحقق من الكاش
    if (this.cache[handle]) {
      return this.cache[handle];
    }

    const res = await fetch(`/ajax/product?handle=${handle}`);
    const product = await res.json();

    // حفظ في الكاش
    this.cache[handle] = product;
    return product;
  },

  async getVariant(productId, selectedOptions, quantity = 1) {
    const res = await fetch('/ajax/product/resolve-variant-by-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        options: selectedOptions,
        quantity
      })
    });
    return res.json();
  },

  // حساب السعر النهائي
  calculatePrice(variant, quantity = 1) {
    return {
      price: variant.price * quantity,
      compareAtPrice: variant.compareAtPrice * quantity,
      savings: (variant.compareAtPrice - variant.price) * quantity
    };
  }
};

window.ProductManager = ProductManager;
```

---

## استخدام في صفحة المنتج

```html
<div x-data="{
  product: null,
  selectedOptions: [],
  variant: null,
  quantity: 1,

  async init() {
    this.product = await ProductManager.get('{{ product.slug }}');
  },

  async selectOption(optionId) {
    this.selectedOptions.push(optionId);
    this.variant = await ProductManager.getVariant(
      this.product._id,
      this.selectedOptions,
      this.quantity
    );
  },

  async addToCart() {
    if (this.variant) {
      await CartManager.add(this.product._id, this.quantity, this.variant._id);
    } else {
      await CartManager.add(this.product._id, this.quantity);
    }
  }
}">
  <!-- خيارات المنتج -->
  <template x-for="option in product?.options">
    <div>
      <label x-text="option.name"></label>
      <select @change="selectOption($event.target.value)">
        <template x-for="value in option.values">
          <option :value="value._id" x-text="value.label"></option>
        </template>
      </select>
    </div>
  </template>

  <!-- السعر -->
  <div>
    <span x-text="variant?.price || product?.pricing?.price"></span>
  </div>

  <!-- الكمية -->
  <input type="number" x-model="quantity" min="1">

  <!-- زر الإضافة -->
  <button @click="addToCart()">أضف للسلة</button>
</div>
```
