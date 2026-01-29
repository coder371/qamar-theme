# الفوتر

## المثال الكامل

```nunjucks
<footer class="bg-gray-900 text-white py-12">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {# معلومات المتجر #}
      <div>
        {% if store.logo.fileUrl %}
          <img src="{{ store.logo.fileUrl }}"
               alt="{{ store.name }}"
               class="h-10 mb-4 brightness-0 invert">
        {% else %}
          <span class="text-2xl font-bold block mb-4">{{ store.name }}</span>
        {% endif %}
        <p class="text-gray-400 text-sm">
          {{ store.description | default('متجرك المفضل للتسوق الإلكتروني') }}
        </p>
      </div>

      {# روابط سريعة #}
      <div>
        <h3 class="font-bold mb-4">{{t("footer.quick_links")}}</h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="/products" class="hover:text-white">{{t("common.products")}}</a></li>
          <li><a href="/collections" class="hover:text-white">{{t("common.categories")}}</a></li>
          <li><a href="/about" class="hover:text-white">{{t("footer.about_us")}}</a></li>
          <li><a href="/contact" class="hover:text-white">{{t("footer.contact_us")}}</a></li>
        </ul>
      </div>

      {# خدمة العملاء #}
      <div>
        <h3 class="font-bold mb-4">{{t("footer.customer_service")}}</h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="/shipping" class="hover:text-white">{{t("footer.shipping")}}</a></li>
          <li><a href="/returns" class="hover:text-white">{{t("footer.returns")}}</a></li>
          <li><a href="/faq" class="hover:text-white">{{t("footer.faq")}}</a></li>
          <li><a href="/privacy" class="hover:text-white">{{t("footer.privacy_policy")}}</a></li>
        </ul>
      </div>

      {# التواصل #}
      <div>
        <h3 class="font-bold mb-4">{{t("footer.contact_us")}}</h3>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li>{{ store.generalSettings.country.name }}</li>
          <li>{{ store.generalSettings.country.phonekey }}</li>
        </ul>

        {# وسائل التواصل #}
        <div class="flex gap-4 mt-4">
          <a href="#" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <!-- Facebook -->
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <!-- Instagram -->
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <!-- Twitter -->
            </svg>
          </a>
        </div>
      </div>

    </div>

    {# حقوق النشر #}
    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
      <p>{{t("footer.copyright")}} {{ store.name }} © 2024</p>
    </div>
  </div>
</footer>
```

---

## schema.json للفوتر

```json
{
  "name": "Footer",
  "settings": {
    "show_newsletter": {
      "type": "boolean",
      "label": "إظهار الاشتراك في النشرة",
      "default": true
    },
    "newsletter_title": {
      "type": "string",
      "label": "عنوان النشرة",
      "default": "اشترك في نشرتنا البريدية"
    },
    "quick_links_menu": {
      "type": "menu",
      "label": "روابط سريعة",
      "default": "footer-quick"
    },
    "support_menu": {
      "type": "menu",
      "label": "خدمة العملاء",
      "default": "footer-support"
    },
    "facebook_url": {
      "type": "string",
      "label": "رابط Facebook",
      "default": ""
    },
    "instagram_url": {
      "type": "string",
      "label": "رابط Instagram",
      "default": ""
    },
    "twitter_url": {
      "type": "string",
      "label": "رابط Twitter",
      "default": ""
    }
  },
  "presets": [
    {
      "category": "Footer",
      "name": "Footer"
    }
  ]
}
```
