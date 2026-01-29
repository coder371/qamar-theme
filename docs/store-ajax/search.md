# Search API

واجهة برمجية للبحث في المنتجات.

## Endpoints

| العملية | الطريقة | المسار |
|---------|---------|--------|
| بحث المنتجات | GET | `/ajax/search/products` |
| اقتراحات البحث | GET | `/ajax/search/suggest` |

---

## بحث المنتجات

```javascript
GET /ajax/search/products
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `q` | string | جملة البحث |
| `minPrice` | number | السعر الأدنى |
| `maxPrice` | number | السعر الأعلى |
| `collectionId` | string | تصفية حسب التصنيف |
| `minRating` | number | التقييم الأدنى (1-5) |
| `sort` | string | ترتيب النتائج |

**خيارات الترتيب:**
| القيمة | الوصف |
|--------|-------|
| `rating-asc` | التقييم تصاعدي |
| `rating-desc` | التقييم تنازلي |
| `price-asc` | السعر تصاعدي |
| `price-desc` | السعر تنازلي |
| `created-asc` | الأقدم أولاً |
| `created-desc` | الأحدث أولاً |

**مثال:**
```javascript
async function searchProducts(query, filters = {}) {
  const params = new URLSearchParams({ q: query, ...filters });
  const res = await fetch(`/ajax/search/products?${params}`);
  return res.json();
}

// بحث بسيط
const results = await searchProducts('ساعة');

// بحث مع فلاتر
const results = await searchProducts('ساعة', {
  minPrice: 100,
  maxPrice: 500,
  sort: 'price-asc'
});

// بحث في تصنيف معين
const results = await searchProducts('', {
  collectionId: 'collection123',
  minRating: 4
});
```

---

## اقتراحات البحث

```javascript
GET /ajax/search/suggest
```

**البارامترات:**
| المعامل | النوع | الوصف |
|---------|------|-------|
| `q` | string | جملة البحث |
| `resources[type]` | string | أنواع المصادر (product, collection) |
| `resources[limit]` | number | حد النتائج |

**مثال:**
```javascript
async function getSuggestions(query) {
  const params = new URLSearchParams({
    q: query,
    'resources[type]': 'product,collection',
    'resources[limit]': 5
  });
  const res = await fetch(`/ajax/search/suggest?${params}`);
  return res.json();
}

// استخدام
const suggestions = await getSuggestions('سا');
```

---

## مثال كامل - Search Manager

```javascript
const SearchManager = {
  async search(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    const res = await fetch(`/ajax/search/products?${params}`);
    return res.json();
  },

  async suggest(query, limit = 5) {
    const params = new URLSearchParams({
      q: query,
      'resources[type]': 'product,collection',
      'resources[limit]': limit
    });
    const res = await fetch(`/ajax/search/suggest?${params}`);
    return res.json();
  },

  // بحث مع debounce
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
};

// استخدام مع debounce
const debouncedSuggest = SearchManager.debounce(async (query) => {
  const suggestions = await SearchManager.suggest(query);
  // عرض الاقتراحات
}, 300);

// في input event
document.querySelector('#search-input').addEventListener('input', (e) => {
  debouncedSuggest(e.target.value);
});
```

---

## استخدام مع Alpine.js

```html
<div x-data="{
  query: '',
  suggestions: [],
  async search() {
    if (this.query.length > 2) {
      this.suggestions = await SearchManager.suggest(this.query);
    } else {
      this.suggestions = [];
    }
  }
}">
  <input
    type="text"
    x-model="query"
    @input.debounce.300ms="search()"
    placeholder="ابحث..."
  >

  <ul x-show="suggestions.length > 0">
    <template x-for="item in suggestions">
      <li x-text="item.title"></li>
    </template>
  </ul>
</div>
```
