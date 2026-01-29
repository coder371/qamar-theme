# الهيدر

## المثال الكامل

```nunjucks
<header class="sticky top-0 z-50 bg-white shadow-md">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between py-4">

      {# زر القائمة للموبايل #}
      <button
        @click="toggleModal('sidebar')"
        class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {# الشعار #}
      <a href="/" class="flex-shrink-0">
        {% if store.logo.fileUrl %}
          <img src="{{ store.logo.fileUrl }}" alt="{{ store.name }}" class="h-10 md:h-12">
        {% else %}
          <span class="text-2xl font-bold text-primary">{{ store.name }}</span>
        {% endif %}
      </a>

      {# القائمة الرئيسية - سطح المكتب #}
      <nav class="hidden lg:flex items-center gap-6">
        {% for item in widget.data.header_menu %}
          <a href="{{ item.url | default('#') }}"
             class="text-gray-700 hover:text-primary font-medium transition-colors">
            {{ item.title }}
          </a>
        {% endfor %}
      </nav>

      {# الإجراءات #}
      <div class="flex items-center gap-3">

        {# البحث #}
        <button
          @click="toggleModal('search')"
          class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>

        {# المفضلة #}
        <a href="/wishlist" class="relative p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          {% if wishlist.count > 0 %}
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ wishlist.count }}
            </span>
          {% endif %}
        </a>

        {# السلة #}
        <button
          @click="toggleModal('cart')"
          class="relative p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          {% if cart.totalQuantity > 0 %}
            <span class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cart.totalQuantity }}
            </span>
          {% endif %}
        </button>

      </div>
    </div>
  </div>
</header>

{# مكونات UI #}
{% ui "sidebar.njk", menu=widget.data.header_menu %}
{% ui "search.njk" %}
{% ui "cart.njk" %}
```

---

## مع شريط إعلانات

```nunjucks
<div class="sticky top-0 z-50">
  {# شريط الإعلانات #}
  {% if widget.data.show_top_bar %}
  <div class="bg-primary text-white text-center py-2 text-sm">
    {{ widget.data.navbar_text }}
  </div>
  {% endif %}

  {# الهيدر الرئيسي #}
  <header class="bg-white shadow-md">
    {# ... محتوى الهيدر ... #}
  </header>
</div>
```

---

## schema.json للهيدر

```json
{
  "name": "Header",
  "settings": {
    "show_top_bar": {
      "type": "boolean",
      "label": "إظهار شريط الإعلانات",
      "default": true
    },
    "navbar_text": {
      "type": "string",
      "label": "نص الإعلان",
      "default": "توصيل مجاني للطلبات فوق 50 دينار"
    },
    "header_menu": {
      "type": "menu",
      "label": "القائمة الرئيسية",
      "default": "main-menu"
    },
    "show_search": {
      "type": "boolean",
      "label": "إظهار البحث",
      "default": true
    },
    "show_cart": {
      "type": "boolean",
      "label": "إظهار السلة",
      "default": true
    }
  },
  "presets": [
    {
      "category": "Header",
      "name": "Header"
    }
  ]
}
```
