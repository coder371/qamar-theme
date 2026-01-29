# الترجمة والتعدد اللغوي (Locales)

نظام الترجمة يتيح دعم لغات متعددة في الثيم.

## الموقع

```
locales/
├── ar.json    # العربية
├── en.json    # الإنجليزية
└── fr.json    # الفرنسية
```

---

## بنية ملف الترجمة

```json
{
  "header": {
    "cart": "سلة التسوق",
    "search": "بحث",
    "wishlist": "المفضلة"
  },
  "product": {
    "add_to_cart": "أضف للسلة",
    "out_of_stock": "نفذت الكمية",
    "price": "السعر",
    "quantity": "الكمية"
  },
  "cart": {
    "empty": "السلة فارغة",
    "total": "المجموع",
    "checkout": "إتمام الطلب",
    "continue_shopping": "متابعة التسوق"
  },
  "common": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "categories": "التصنيفات",
    "contact": "اتصل بنا",
    "about": "من نحن"
  }
}
```

---

## استخدام الترجمة في القوالب

### الصيغة الصحيحة: `{{t('key')}}`

```nunjucks
{# ✅ الصيغة الصحيحة #}
<button>{{t("product.add_to_cart")}}</button>
<span>{{t("header.cart")}}</span>
<p>{{t("cart.empty")}}</p>

{# ❌ صيغة خاطئة - لا تستخدمها #}
<button>{% t("product.add_to_cart") %}</button>
```

> ⚠️ **مهم**: استخدم `{{t('key')}}` (أقواس مزدوجة) وليس `{% t('key') %}` (أقواس نسبة مئوية)

### مثال Header

```nunjucks
<header>
  <nav>
    <a href="/">{{t("common.home")}}</a>
    <a href="/products">{{t("common.products")}}</a>
    <a href="/categories">{{t("common.categories")}}</a>
  </nav>

  <div class="actions">
    <button>{{t("header.search")}}</button>
    <a href="/cart">{{t("header.cart")}}</a>
    <a href="/wishlist">{{t("header.wishlist")}}</a>
  </div>
</header>
```

### مثال صفحة المنتج

```nunjucks
<div class="product-details">
  <p class="price">
    <span>{{t("product.price")}}:</span>
    {{ product.pricing.price | money }}
  </p>

  <div class="quantity">
    <label>{{t("product.quantity")}}</label>
    <input type="number" value="1" min="1">
  </div>

  {% if product.quantity > 0 %}
    <button class="add-to-cart">
      {{t("product.add_to_cart")}}
    </button>
  {% else %}
    <button disabled>
      {{t("product.out_of_stock")}}
    </button>
  {% endif %}
</div>
```

---

## نصائح التنظيم

1. **تجميع حسب الموقع** - header, footer, product, cart, etc.
2. **أسماء مفاتيح واضحة** - استخدم أسماء وصفية
3. **التناسق** - حافظ على نفس المفاتيح في جميع اللغات
4. **الكائنات المتداخلة** - نظم المفاتيح في مجموعات منطقية

---

## مثال كامل - ar.json

```json
{
  "header": {
    "cart": "سلة التسوق",
    "search": "بحث",
    "search_placeholder": "ابحث عن منتجات...",
    "wishlist": "المفضلة"
  },
  "footer": {
    "quick_links": "روابط سريعة",
    "customer_service": "خدمة العملاء",
    "contact_us": "اتصل بنا",
    "about_us": "من نحن",
    "privacy_policy": "سياسة الخصوصية",
    "terms": "الشروط والأحكام",
    "copyright": "جميع الحقوق محفوظة"
  },
  "product": {
    "add_to_cart": "أضف للسلة",
    "buy_now": "اشتر الآن",
    "out_of_stock": "نفذت الكمية",
    "in_stock": "متوفر",
    "price": "السعر",
    "quantity": "الكمية",
    "description": "الوصف",
    "reviews": "التقييمات",
    "related_products": "منتجات ذات صلة",
    "add_to_wishlist": "أضف للمفضلة",
    "remove_from_wishlist": "إزالة من المفضلة",
    "share": "مشاركة"
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": "السلة فارغة",
    "empty_message": "لم تقم بإضافة أي منتجات بعد",
    "subtotal": "المجموع الفرعي",
    "total": "المجموع",
    "discount": "الخصم",
    "shipping": "الشحن",
    "checkout": "إتمام الطلب",
    "continue_shopping": "متابعة التسوق",
    "remove": "حذف",
    "update": "تحديث"
  },
  "wishlist": {
    "title": "المفضلة",
    "empty": "المفضلة فارغة",
    "empty_message": "لم تقم بإضافة أي منتجات للمفضلة",
    "add_all_to_cart": "أضف الكل للسلة"
  },
  "search": {
    "title": "نتائج البحث",
    "placeholder": "ابحث...",
    "no_results": "لا توجد نتائج",
    "results_for": "نتائج البحث عن"
  },
  "common": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "categories": "التصنيفات",
    "all_products": "جميع المنتجات",
    "new_arrivals": "وصل حديثاً",
    "best_sellers": "الأكثر مبيعاً",
    "on_sale": "تخفيضات",
    "load_more": "تحميل المزيد",
    "view_all": "عرض الكل",
    "back": "رجوع",
    "close": "إغلاق",
    "save": "حفظ",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "error": "حدث خطأ",
    "success": "تم بنجاح"
  },
  "currency": {
    "sar": "ر.س",
    "kwd": "د.ك",
    "usd": "$"
  }
}
```

---

## مثال - en.json

```json
{
  "header": {
    "cart": "Shopping Cart",
    "search": "Search",
    "search_placeholder": "Search products...",
    "wishlist": "Wishlist"
  },
  "product": {
    "add_to_cart": "Add to Cart",
    "buy_now": "Buy Now",
    "out_of_stock": "Out of Stock",
    "in_stock": "In Stock",
    "price": "Price",
    "quantity": "Quantity"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Cart is empty",
    "total": "Total",
    "checkout": "Checkout",
    "continue_shopping": "Continue Shopping"
  },
  "common": {
    "home": "Home",
    "products": "Products",
    "categories": "Categories"
  }
}
```
