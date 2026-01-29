# صفحة المفضلة

## المثال الكامل

```nunjucks
<div class="wishlist-page max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">{{t("wishlist.title")}} ({{ wishlist.count }})</h1>

  {% if wishlist.products.length > 0 %}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {% for product in wishlist.products %}
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
          {# الصورة #}
          <div class="relative">
            <a href="/product/{{ product.slug }}">
              <img src="{{ product.images[0].fileUrl }}"
                   alt="{{ product.title }}"
                   class="w-full h-48 object-cover">
            </a>

            {# زر الحذف #}
            <button
              @click="WishlistManager.remove('{{ product._id }}')"
              class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="p-4">
            {# اسم المنتج #}
            <h3 class="font-medium mb-2 line-clamp-2">
              <a href="/product/{{ product.slug }}" class="hover:text-primary">
                {{ product.title }}
              </a>
            </h3>

            {# السعر #}
            <div class="flex items-center gap-2 mb-3">
              {% if product.pricing.compareAtPrice > product.pricing.price %}
                <span class="text-gray-400 line-through text-sm">
                  {{ product.pricing.compareAtPrice | money }}
                </span>
              {% endif %}
              <span class="text-primary font-bold">
                {{ product.pricing.price | money }}
              </span>
            </div>

            {# التوفر #}
            {% if product.quantity > 0 %}
              <span class="text-green-600 text-sm">{{t("product.in_stock")}}</span>
            {% else %}
              <span class="text-red-500 text-sm">{{t("product.out_of_stock")}}</span>
            {% endif %}

            {# زر الإضافة للسلة #}
            <button
              @click="CartManager.add('{{ product._id }}')"
              class="w-full mt-3 bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              {% if product.quantity <= 0 %}disabled{% endif %}>
              {{t("product.add_to_cart")}}
            </button>
          </div>
        </div>
      {% endfor %}
    </div>

    {# أزرار إضافية #}
    <div class="flex justify-center gap-4 mt-8">
      <button
        @click="addAllToCart()"
        class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
        {{t("wishlist.add_all_to_cart")}}
      </button>
      <button
        @click="WishlistManager.clear()"
        class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
        {{t("wishlist.clear")}}
      </button>
    </div>

  {% else %}
    {# المفضلة فارغة #}
    <div class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
      <h2 class="text-xl font-bold text-gray-600 mb-2">{{t("wishlist.empty")}}</h2>
      <p class="text-gray-400 mb-6">{{t("wishlist.empty_message")}}</p>
      <a href="/products"
         class="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90">
        {{t("common.products")}}
      </a>
    </div>
  {% endif %}
</div>

<script>
  async function addAllToCart() {
    const products = {{ wishlist.products | dump | safe }};
    for (const product of products) {
      if (product.quantity > 0) {
        await CartManager.add(product._id);
      }
    }
  }
</script>
```
