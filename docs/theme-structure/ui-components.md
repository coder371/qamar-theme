# مكونات UI

مكونات UI هي قوالب قابلة لإعادة الاستخدام للعناصر الشائعة.

## الموقع

```
ui/
├── sidebar.njk      # القائمة الجانبية
├── search.njk       # نموذج البحث
├── cart.njk         # سلة التسوق المنبثقة
├── modal.njk        # نافذة منبثقة عامة
└── product-card.njk # بطاقة منتج
```

---

## استخدام مكونات UI

### إدراج بسيط

```nunjucks
{% ui "sidebar.njk" %}
{% ui "search.njk" %}
{% ui "cart.njk" %}
```

### إدراج مع تمرير بيانات

```nunjucks
{% ui "sidebar.njk", menu=widget.data.header_menu %}
{% ui "product-card.njk", product=item %}
{% ui "modal.njk", id="search-modal", title="البحث" %}
```

---

## أمثلة المكونات

### sidebar.njk - القائمة الجانبية

```nunjucks
<div x-cloak x-show="modal.open && modal.type === 'sidebar'" class="fixed inset-0 z-50">
  {# Overlay #}
  <div @click="toggleModal('sidebar')"
       x-show="modal.open && modal.type === 'sidebar'"
       x-transition:enter="transition-opacity ease-out duration-300"
       x-transition:enter-start="opacity-0"
       x-transition:enter-end="opacity-100"
       x-transition:leave="transition-opacity ease-in duration-300"
       x-transition:leave-start="opacity-100"
       x-transition:leave-end="opacity-0"
       class="absolute inset-0 bg-black/50 backdrop-blur-sm">
  </div>

  {# Panel #}
  <div class="absolute top-0 right-0 bg-white w-4/5 max-w-sm h-full shadow-2xl"
       x-show="modal.open && modal.type === 'sidebar'"
       x-transition:enter="transition ease-in-out duration-300 transform"
       x-transition:enter-start="translate-x-full"
       x-transition:enter-end="translate-x-0"
       x-transition:leave="transition ease-in-out duration-300 transform"
       x-transition:leave-start="translate-x-0"
       x-transition:leave-end="translate-x-full">

    <div class="flex flex-col h-full">
      {# Header #}
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-bold">{{t("header.menu")}}</h2>
        <button @click="toggleModal('sidebar')" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {# Menu Items #}
      <nav class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          {% for item in data.menu %}
            <li>
              <a href="{{ item.url | default('#') }}"
                 @click="toggleModal('sidebar')"
                 class="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
                {{ item.title }}
              </a>
            </li>
          {% endfor %}
        </ul>
      </nav>
    </div>
  </div>
</div>
```

### search.njk - نموذج البحث

```nunjucks
<div x-cloak x-show="modal.open && modal.type === 'search'" class="fixed inset-0 z-50">
  {# Overlay #}
  <div @click="toggleModal('search')"
       class="absolute inset-0 bg-black/50 backdrop-blur-sm"
       x-transition:enter="transition-opacity duration-300"
       x-transition:enter-start="opacity-0"
       x-transition:enter-end="opacity-100">
  </div>

  {# Search Box #}
  <div class="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg"
       x-transition:enter="transition duration-300 transform"
       x-transition:enter-start="-translate-y-full"
       x-transition:enter-end="translate-y-0">

    <div class="container mx-auto">
      <form action="/search" method="GET" class="flex gap-2">
        <input type="text"
               name="q"
               x-model="search"
               placeholder="{{t('search.placeholder')}}"
               class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
               autofocus>
        <button type="submit"
                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
          {{t("header.search")}}
        </button>
        <button type="button"
                @click="toggleModal('search')"
                class="px-4 py-3 border rounded-lg hover:bg-gray-100">
          {{t("common.close")}}
        </button>
      </form>
    </div>
  </div>
</div>
```

### cart.njk - سلة التسوق المنبثقة

```nunjucks
<div x-cloak x-show="modal.open && modal.type === 'cart'" class="fixed inset-0 z-50">
  {# Overlay #}
  <div @click="toggleModal('cart')"
       class="absolute inset-0 bg-black/50 backdrop-blur-sm">
  </div>

  {# Panel #}
  <div class="absolute top-0 left-0 bg-white w-4/5 max-w-md h-full shadow-2xl"
       x-transition:enter="transition duration-300 transform"
       x-transition:enter-start="-translate-x-full"
       x-transition:enter-end="translate-x-0">

    <div class="flex flex-col h-full">
      {# Header #}
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-bold">
          {{t("cart.title")}}
          <span x-text="'(' + (cart?.items?.length || 0) + ')'" class="text-gray-500 font-normal"></span>
        </h2>
        <button @click="toggleModal('cart')" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {# Items #}
      <div class="flex-1 overflow-y-auto p-4">
        <template x-if="!cart?.items?.length">
          <div class="flex flex-col items-center justify-center h-full text-center">
            <p class="text-gray-500 mb-4">{{t("cart.empty")}}</p>
            <a href="/products" @click="toggleModal('cart')"
               class="px-6 py-2 bg-primary text-white rounded-lg">
              {{t("common.products")}}
            </a>
          </div>
        </template>

        <template x-if="cart?.items?.length">
          <div class="space-y-4">
            <template x-for="item in cart.items" :key="item._id">
              <div class="flex gap-4 p-3 bg-gray-50 rounded-lg">
                <img :src="item.productData?.image?.fileUrl"
                     class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                  <h4 class="font-medium" x-text="item.productData?.title"></h4>
                  <p class="text-primary font-bold" x-text="formatMoney(item.price)"></p>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      {# Footer #}
      <template x-if="cart?.items?.length">
        <div class="p-4 border-t space-y-4">
          <div class="flex justify-between">
            <span>{{t("cart.total")}}</span>
            <span class="font-bold" x-text="formatMoney(cart.totalPrice)"></span>
          </div>
          <a href="/cart" @click="toggleModal('cart')"
             class="block w-full py-3 bg-primary text-white text-center rounded-lg">
            {{t("cart.checkout")}}
          </a>
        </div>
      </template>
    </div>
  </div>
</div>
```

### product-card.njk - بطاقة منتج

```nunjucks
<div class="product-card bg-white rounded-lg shadow-md overflow-hidden group">
  {# Image #}
  <div class="relative overflow-hidden">
    <a href="/product/{{ data.product.slug }}">
      <img src="{{ data.product.images[0].fileUrl }}"
           alt="{{ data.product.title }}"
           class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
    </a>

    {% if data.product.pricing.compareAtPrice > data.product.pricing.price %}
      <span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        {{t("common.on_sale")}}
      </span>
    {% endif %}
  </div>

  <div class="p-4">
    <h3 class="font-bold mb-2 line-clamp-2">
      <a href="/product/{{ data.product.slug }}" class="hover:text-primary">
        {{ data.product.title }}
      </a>
    </h3>

    <div class="flex items-center gap-2">
      {% if data.product.pricing.compareAtPrice > data.product.pricing.price %}
        <span class="text-gray-400 line-through text-sm">
          {{ data.product.pricing.compareAtPrice | money }}
        </span>
      {% endif %}
      <span class="text-primary font-bold">
        {{ data.product.pricing.price | money }}
      </span>
    </div>
  </div>
</div>
```

---

## استخدام المكونات في الويدجات

```nunjucks
{# في widget.njk #}
<header>
  {# محتوى الهيدر #}
</header>

{# إدراج مكونات UI #}
{% ui "sidebar.njk", menu=widget.data.header_menu %}
{% ui "search.njk" %}
{% ui "cart.njk" %}
```
