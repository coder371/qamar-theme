# صفحة السلة

## المثال الكامل

```nunjucks
<div class="cart-page max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">{{t("cart.title")}}</h1>

  {% if cart.items.length > 0 %}
    {# قائمة المنتجات #}
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {% for item in cart.items %}
        <div class="flex gap-4 p-4 border-b last:border-b-0">
          {# الصورة #}
          <img src="{{ item.productData.image.fileUrl }}"
               alt="{{ item.productData.title }}"
               class="w-24 h-24 object-cover rounded-lg">

          <div class="flex-1">
            {# اسم المنتج #}
            <h3 class="font-medium mb-1">
              <a href="/product/{{ item.productData.slug }}" class="hover:text-primary">
                {{ item.productData.title }}
              </a>
            </h3>

            {# خيارات المتغير #}
            {% if item.variantData %}
              <div class="text-sm text-gray-500 mb-2">
                {% for option in item.variantData.options %}
                  <span>{{ option.option.name }}: {{ option.label }}</span>
                  {% if not loop.last %} | {% endif %}
                {% endfor %}
              </div>
            {% endif %}

            {# السعر والكمية #}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  @click="CartManager.update('{{ item._id }}', {{ item.quantity - 1 }})"
                  class="w-8 h-8 border rounded-lg hover:bg-gray-100"
                  {% if item.quantity <= 1 %}disabled{% endif %}>
                  -
                </button>
                <span class="w-8 text-center">{{ item.quantity }}</span>
                <button
                  @click="CartManager.update('{{ item._id }}', {{ item.quantity + 1 }})"
                  class="w-8 h-8 border rounded-lg hover:bg-gray-100">
                  +
                </button>
              </div>

              <div class="text-left">
                {% if item.compareAtPrice > item.price %}
                  <span class="text-gray-400 line-through text-sm block">
                    {{ item.totalCompareAtPrice | money }}
                  </span>
                {% endif %}
                <span class="font-bold text-primary">
                  {{ item.totalPrice | money }}
                </span>
              </div>
            </div>
          </div>

          {# زر الحذف #}
          <button
            @click="CartManager.remove('{{ item._id }}')"
            class="p-2 text-gray-400 hover:text-red-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      {% endfor %}
    </div>

    {# ملخص الطلب #}
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-bold mb-4">{{t("cart.summary")}}</h2>

      <div class="space-y-3 mb-4">
        <div class="flex justify-between">
          <span class="text-gray-600">{{t("cart.subtotal")}} ({{ cart.totalQuantity }} {{t("cart.items")}})</span>
          <span>{{ cart.totalPrice | money }}</span>
        </div>

        {% if cart.totalSavings > 0 %}
          <div class="flex justify-between text-green-600">
            <span>{{t("cart.savings")}}</span>
            <span>-{{ cart.totalSavings | money }}</span>
          </div>
        {% endif %}

        {% if cart.couponApplied %}
          <div class="flex justify-between text-primary">
            <span>{{t("cart.coupon_discount")}}</span>
            <span>-{{ cart.couponDiscount | money }}</span>
          </div>
        {% endif %}

        <div class="flex justify-between border-t pt-3">
          <span class="font-bold">{{t("cart.total")}}</span>
          <span class="font-bold text-xl">{{ cart.totalPrice | money }}</span>
        </div>
      </div>

      <a href="/checkout"
         class="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        {{t("cart.checkout")}}
      </a>

      <a href="/products"
         class="block w-full text-center py-3 mt-2 text-gray-600 hover:text-primary">
        {{t("cart.continue_shopping")}}
      </a>
    </div>

  {% else %}
    {# السلة فارغة #}
    <div class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <h2 class="text-xl font-bold text-gray-600 mb-2">{{t("cart.empty")}}</h2>
      <p class="text-gray-400 mb-6">{{t("cart.empty_message")}}</p>
      <a href="/products"
         class="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        {{t("common.products")}}
      </a>
    </div>
  {% endif %}
</div>
```
