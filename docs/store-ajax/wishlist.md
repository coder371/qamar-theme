# Wishlist API

واجهة برمجية للتعامل مع قائمة المفضلة.

## Endpoints

| العملية | الطريقة | المسار |
|---------|---------|--------|
| إضافة للمفضلة | POST | `/ajax/wishlist/add` |
| إزالة من المفضلة | POST | `/ajax/wishlist/remove` |
| مسح المفضلة | POST | `/ajax/wishlist/clear` |

---

## إضافة للمفضلة

```javascript
POST /ajax/wishlist/add
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `productId` | string | معرّف المنتج |

**مثال:**
```javascript
async function addToWishlist(productId) {
  const res = await fetch('/ajax/wishlist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });
  return res.json();
}

// استخدام
await addToWishlist('product123');
```

---

## إزالة من المفضلة

```javascript
POST /ajax/wishlist/remove
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `productId` | string | معرّف المنتج |

**مثال:**
```javascript
async function removeFromWishlist(productId) {
  const res = await fetch('/ajax/wishlist/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });
  return res.json();
}

// استخدام
await removeFromWishlist('product123');
```

---

## مسح المفضلة

```javascript
POST /ajax/wishlist/clear
```

**مثال:**
```javascript
async function clearWishlist() {
  const res = await fetch('/ajax/wishlist/clear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}
```

---

## مثال كامل - Wishlist Manager

```javascript
const WishlistManager = {
  async add(productId) {
    const res = await fetch('/ajax/wishlist/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    this.updateUI(data);
    return data;
  },

  async remove(productId) {
    const res = await fetch('/ajax/wishlist/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    this.updateUI(data);
    return data;
  },

  async clear() {
    const res = await fetch('/ajax/wishlist/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    this.updateUI(data);
    return data;
  },

  async toggle(productId, isInWishlist) {
    if (isInWishlist) {
      return this.remove(productId);
    } else {
      return this.add(productId);
    }
  },

  updateUI(data) {
    // تحديث عداد المفضلة
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = data.count || 0;
    });

    // إرسال حدث مخصص
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: data }));
  }
};

window.WishlistManager = WishlistManager;
```

---

## استخدام مع Alpine.js

```html
<button
  @click="WishlistManager.toggle(productId, isInWishlist)"
  :class="{ 'text-red-500': isInWishlist }"
>
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <!-- أيقونة القلب -->
  </svg>
</button>
```

---

## استخدام في Nunjucks

### زر المفضلة

```nunjucks
<button
  onclick="WishlistManager.toggle('{{ product._id }}')"
  data-wishlist-btn="{{ product._id }}"
  class="wishlist-btn">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
    </path>
  </svg>
</button>
```

### عرض المفضلة

```nunjucks
{% if wishlist.count > 0 %}
  <p>لديك {{ wishlist.count }} منتج في المفضلة</p>

  {% for product in wishlist.products %}
    <div class="product-card">
      <img src="{{ product.images[0].fileUrl }}" alt="{{ product.title }}">
      <h3>{{ product.title }}</h3>
      <span>{{ product.pricing.price | money }}</span>

      <button onclick="WishlistManager.remove('{{ product._id }}')">
        إزالة من المفضلة
      </button>

      <button onclick="CartManager.add('{{ product._id }}')">
        أضف للسلة
      </button>
    </div>
  {% endfor %}
{% else %}
  <p>المفضلة فارغة</p>
{% endif %}
```

### Data Attributes

```html
<!-- عداد المفضلة (يتحدث تلقائياً) -->
<span data-wishlist-count>{{ wishlist.count }}</span>

<!-- زر المفضلة (يضاف له class 'active') -->
<button data-wishlist-btn="{{ product._id }}">♡</button>
```
