# بطاقة منتج

## مثال أساسي

```nunjucks
<div class="product-card bg-white rounded-lg shadow-md overflow-hidden group">
  {# الصورة #}
  <div class="relative overflow-hidden">
    <a href="/product/{{ product.slug }}">
      <img src="{{ product.images[0].fileUrl }}"
           alt="{{ product.title }}"
           class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
    </a>

    {# شارة الخصم #}
    {% if product.pricing.compareAtPrice > product.pricing.price %}
      {% set discount = ((product.pricing.compareAtPrice - product.pricing.price) / product.pricing.compareAtPrice * 100) | round %}
      <span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        -{{ discount }}%
      </span>
    {% endif %}
  </div>

  <div class="p-4">
    {# اسم المنتج #}
    <h3 class="font-bold text-lg mb-2 line-clamp-2">
      <a href="/product/{{ product.slug }}" class="hover:text-primary">
        {{ product.title }}
      </a>
    </h3>

    {# السعر #}
    <div class="flex items-center gap-2">
      {% if product.pricing.compareAtPrice > product.pricing.price %}
        <span class="text-gray-400 line-through text-sm">
          {{ product.pricing.compareAtPrice | money }}
        </span>
        <span class="text-primary font-bold">
          {{ product.pricing.price | money }}
        </span>
      {% else %}
        <span class="font-bold">
          {{ product.pricing.price | money }}
        </span>
      {% endif %}
    </div>

    {# التقييم #}
    {% if product.reviewsCount > 0 %}
      <div class="flex items-center gap-1 mt-2">
        <div class="flex text-yellow-400">
          {% for i in range(5) %}
            {% if i < product.averageRating %}
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            {% else %}
              <svg class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            {% endif %}
          {% endfor %}
        </div>
        <span class="text-gray-400 text-sm">({{ product.reviewsCount }})</span>
      </div>
    {% endif %}

    {# زر الإضافة للسلة #}
    <button
      @click="CartManager.add('{{ product._id }}')"
      class="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
      أضف للسلة
    </button>
  </div>
</div>
```

---

## مع زر المفضلة

```nunjucks
<div class="product-card bg-white rounded-lg shadow-md overflow-hidden group relative">
  {# زر المفضلة #}
  <button
    @click="WishlistManager.toggle('{{ product._id }}', isInWishlist)"
    class="absolute top-2 left-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
    <svg class="w-5 h-5" :class="isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  </button>

  {# الصورة #}
  <div class="relative overflow-hidden">
    <img src="{{ product.images[0].fileUrl }}"
         alt="{{ product.title }}"
         class="w-full h-48 object-cover">
  </div>

  <div class="p-4">
    <h3 class="font-bold mb-2">{{ product.title }}</h3>
    <p class="text-primary font-bold">{{ product.pricing.price | money }}</p>
  </div>
</div>
```

---

## شبكة منتجات

```nunjucks
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {% for product in products %}
    {% ui "product-card.njk", product=product %}
  {% endfor %}
</div>
```
