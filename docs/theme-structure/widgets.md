# إنشاء الويدجات

دليل إنشاء ويدجت جديد في قمرة.

## بنية الويدجت

```
widgets/
└── widget-name/
    ├── schema.json        # إعدادات الويدجت
    └── widget.njk         # قالب الويدجت
```

> **ملاحظة:** أسماء الويدجات يجب أن تكون بأحرف صغيرة مع أرقام وشرطات فقط.
> مثال: `hero-slider`, `product-card`, `faq-section`

---

## 1. إنشاء schema.json

ملف الإعدادات يحدد خيارات الويدجت القابلة للتعديل من لوحة التحكم.

### البنية الأساسية

```json
{
  "name": "اسم الويدجت",
  "settings": {
    // الإعدادات هنا
  },
  "blocks": {
    // الـ Blocks هنا (اختياري)
  },
  "presets": [
    {
      "category": "اسم التصنيف",
      "name": "اسم الويدجت في القائمة"
    }
  ]
}
```

---

## 2. أنواع الإعدادات (Settings Types)

### `string` - نص سطر واحد

```json
{
  "title": {
    "type": "string",
    "label": "العنوان",
    "default": "مرحباً بكم"
  }
}
```

### `text` - نص متعدد الأسطر

```json
{
  "description": {
    "type": "text",
    "label": "الوصف",
    "default": "وصف طويل هنا..."
  }
}
```

### `number` - رقم

```json
{
  "items_count": {
    "type": "number",
    "label": "عدد العناصر",
    "default": 4,
    "min": 1,
    "max": 12,
    "step": 1
  }
}
```

### `boolean` - صح/خطأ

```json
{
  "show_button": {
    "type": "boolean",
    "label": "إظهار الزر",
    "default": true
  }
}
```

### `color` - لون

```json
{
  "background_color": {
    "type": "color",
    "label": "لون الخلفية",
    "default": "#ffffff"
  }
}
```

### `select` - قائمة منسدلة

```json
{
  "layout": {
    "type": "select",
    "label": "التخطيط",
    "default": "grid",
    "options": [
      { "value": "grid", "label": "شبكة" },
      { "value": "list", "label": "قائمة" },
      { "value": "carousel", "label": "سلايدر" }
    ]
  }
}
```

### `range` - شريط تمرير

```json
{
  "opacity": {
    "type": "range",
    "label": "الشفافية",
    "default": 100,
    "min": 0,
    "max": 100,
    "step": 10,
    "unit": "%"
  }
}
```

### `media` - صورة/وسائط

```json
{
  "background_image": {
    "type": "media",
    "label": "صورة الخلفية"
  }
}
```

### `menu` - قائمة

```json
{
  "main_menu": {
    "type": "menu",
    "label": "القائمة الرئيسية",
    "default": "header"
  }
}
```

### `products` - منتجات

```json
{
  "featured_products": {
    "type": "products",
    "label": "المنتجات المميزة"
  }
}
```

---

## 3. الـ Blocks (محتوى قابل للتكرار)

الـ Blocks تتيح للمستخدمين إضافة عناصر متعددة من نفس النوع.

**استخدامات شائعة:**
- شرائح السلايدر
- الأسئلة الشائعة (FAQ)
- التقييمات والشهادات
- ميزات المنتج
- عناصر القائمة

### مثال: سلايدر بانر

#### schema.json

```json
{
  "name": "سلايدر البانر",
  "settings": {
    "autoplay": {
      "type": "boolean",
      "label": "تشغيل تلقائي",
      "default": true
    },
    "interval": {
      "type": "number",
      "label": "مدة العرض (ثانية)",
      "default": 5,
      "min": 2,
      "max": 10
    }
  },
  "blocks": {
    "slide": {
      "name": "شريحة",
      "settings": {
        "image": {
          "type": "media",
          "label": "الصورة"
        },
        "title": {
          "type": "string",
          "label": "العنوان",
          "default": "عنوان الشريحة"
        },
        "subtitle": {
          "type": "string",
          "label": "العنوان الفرعي"
        },
        "button_text": {
          "type": "string",
          "label": "نص الزر",
          "default": "تسوق الآن"
        },
        "button_url": {
          "type": "string",
          "label": "رابط الزر",
          "default": "/products"
        }
      }
    }
  },
  "presets": [
    {
      "category": "الصفحة الرئيسية",
      "name": "سلايدر البانر"
    }
  ]
}
```

#### widget.njk

```nunjucks
<div class="hero-slider" data-autoplay="{{ widget.data.autoplay }}" data-interval="{{ widget.data.interval }}">
  {% for block in widget.blocks %}
    <div class="slide">
      {% if block.settings.image %}
        <img src="{{ block.settings.image.fileUrl }}" alt="{{ block.settings.title }}">
      {% endif %}

      <div class="slide-content">
        <h2>{{ block.settings.title }}</h2>

        {% if block.settings.subtitle %}
          <p>{{ block.settings.subtitle }}</p>
        {% endif %}

        {% if block.settings.button_text %}
          <a href="{{ block.settings.button_url | default('#') }}" class="btn">
            {{ block.settings.button_text }}
          </a>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
```

### مثال: الأسئلة الشائعة (FAQ)

#### schema.json

```json
{
  "name": "الأسئلة الشائعة",
  "settings": {
    "title": {
      "type": "string",
      "label": "العنوان",
      "default": "الأسئلة الشائعة"
    }
  },
  "blocks": {
    "question": {
      "name": "سؤال",
      "settings": {
        "question": {
          "type": "string",
          "label": "السؤال"
        },
        "answer": {
          "type": "text",
          "label": "الإجابة"
        }
      }
    }
  },
  "presets": [
    {
      "category": "عام",
      "name": "الأسئلة الشائعة"
    }
  ]
}
```

#### widget.njk

```nunjucks
<section class="faq-section py-12">
  <div class="container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-8 text-center">{{ widget.data.title }}</h2>

    <div class="max-w-3xl mx-auto space-y-4">
      {% for block in widget.blocks %}
        <div class="faq-item border rounded-lg" x-data="{ open: false }">
          <button
            @click="open = !open"
            class="w-full flex items-center justify-between p-4 text-right font-medium">
            <span>{{ block.settings.question }}</span>
            <svg class="w-5 h-5 transition-transform" :class="{ 'rotate-180': open }">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div x-show="open" x-collapse class="px-4 pb-4 text-gray-600">
            {{ block.settings.answer }}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>
```

---

## 4. مثال كامل لـ schema.json

```json
{
  "name": "بانر ترحيبي",
  "settings": {
    "title": {
      "type": "string",
      "label": "العنوان الرئيسي",
      "default": "مرحباً بكم في متجرنا"
    },
    "subtitle": {
      "type": "string",
      "label": "العنوان الفرعي",
      "default": "اكتشف أحدث المنتجات"
    },
    "show_button": {
      "type": "boolean",
      "label": "إظهار زر التسوق",
      "default": true
    },
    "button_text": {
      "type": "string",
      "label": "نص الزر",
      "default": "تسوق الآن"
    },
    "button_url": {
      "type": "string",
      "label": "رابط الزر",
      "default": "/products"
    },
    "background_color": {
      "type": "color",
      "label": "لون الخلفية",
      "default": "#f8f9fa"
    },
    "text_color": {
      "type": "color",
      "label": "لون النص",
      "default": "#333333"
    }
  },
  "presets": [
    {
      "category": "الصفحة الرئيسية",
      "name": "بانر ترحيبي"
    }
  ]
}
```

---

## 5. إنشاء widget.njk

قالب الويدجت يحدد شكل العرض.

### الوصول للإعدادات

```nunjucks
{# إعدادات الويدجت #}
{{ widget.data.title }}
{{ widget.data.show_button }}
{{ widget.data.background_color }}

{# الـ Blocks #}
{% for block in widget.blocks %}
  {{ block.settings.propertyName }}
{% endfor %}
```

> **مهم**: في ملفات الصفحات (pages/*.json)، كل block يجب أن يحتوي على `"name"` و `"block"` و `"settings"`:
> ```json
> {
>   "blocks": [
>     {
>       "name": "شريحة العروض",   // الاسم في Theme Editor
>       "block": "slide",         // نوع الـ block
>       "settings": {             // إعدادات الـ block
>         "title": "العنوان"
>       }
>     }
>   ]
> }
> ```

### مثال كامل

```nunjucks
<section
  class="py-16 px-4"
  style="background-color: {{ widget.data.background_color }}; color: {{ widget.data.text_color }}">

  <div class="container mx-auto text-center">
    {# العنوان الرئيسي #}
    <h1 class="text-4xl font-bold mb-4">
      {{ widget.data.title }}
    </h1>

    {# العنوان الفرعي #}
    {% if widget.data.subtitle %}
      <p class="text-xl mb-8 opacity-80">
        {{ widget.data.subtitle }}
      </p>
    {% endif %}

    {# زر التسوق #}
    {% if widget.data.show_button %}
      <a href="{{ widget.data.button_url | default('/products') }}"
         class="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        {{ widget.data.button_text }}
      </a>
    {% endif %}
  </div>
</section>
```

---

## 6. ويدجت مع قائمة

### schema.json

```json
{
  "name": "قائمة روابط",
  "settings": {
    "title": {
      "type": "string",
      "label": "عنوان القسم",
      "default": "روابط سريعة"
    },
    "menu": {
      "type": "menu",
      "label": "القائمة",
      "default": "footer"
    }
  },
  "presets": [
    {
      "category": "الفوتر",
      "name": "قائمة روابط"
    }
  ]
}
```

### widget.njk

```nunjucks
<div class="py-8">
  <h3 class="text-lg font-bold mb-4">{{ widget.data.title }}</h3>

  <ul class="space-y-2">
    {% for item in widget.data.menu %}
      <li>
        <a href="{{ item.url | default('#') }}"
           class="text-gray-600 hover:text-primary transition-colors">
          {{ item.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</div>
```

---

## 7. ويدجت مع مكونات UI

### widget.njk

```nunjucks
<header class="bg-white shadow-md">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">

      {# الشعار #}
      <a href="/">
        {% if store.logo.fileUrl %}
          <img src="{{ store.logo.fileUrl }}" alt="{{ store.name }}" class="h-12">
        {% else %}
          <span class="text-2xl font-bold text-primary">{{ store.name }}</span>
        {% endif %}
      </a>

      {# القائمة #}
      <nav class="hidden lg:flex items-center gap-6">
        {% for item in widget.data.header_menu %}
          <a href="{{ item.url | default('#') }}" class="text-gray-700 hover:text-primary">
            {{ item.title }}
          </a>
        {% endfor %}
      </nav>

      {# زر القائمة للموبايل #}
      <button @click="toggleModal('sidebar')" class="lg:hidden p-2">
        <svg class="w-6 h-6"><!-- أيقونة --></svg>
      </button>

    </div>
  </div>
</header>

{# مكونات UI #}
{% ui "sidebar.njk", menu=widget.data.header_menu %}
{% ui "search.njk" %}
{% ui "cart.njk" %}
```

---

## 8. إنشاء ويدجت باستخدام CLI

```bash
qumra gen widget banner
```

هذا الأمر ينشئ:
```
widgets/
└── banner/
    ├── schema.json
    └── widget.njk
```

---

## ملخص أنواع الإعدادات

| النوع | الوصف | خصائص إضافية |
|-------|-------|--------------|
| `string` | نص سطر واحد | — |
| `text` | نص متعدد الأسطر | — |
| `number` | رقم | `min`, `max`, `step` |
| `boolean` | تشغيل/إيقاف | — |
| `color` | منتقي ألوان | — |
| `select` | قائمة منسدلة | `options` |
| `range` | شريط تمرير | `min`, `max`, `step`, `unit` |
| `media` | صورة/وسائط | — |
| `menu` | قائمة روابط | — |
| `products` | منتجات | — |

---

## نصائح

1. **اختر أسماء واضحة** - للإعدادات والويدجت (أحرف صغيرة وشرطات فقط)
2. **قيم افتراضية منطقية** - حتى يعمل الويدجت بدون تعديل
3. **استخدم Tailwind** - لتنسيق سريع ومتجاوب
4. **تحقق من القيم** - استخدم `{% if %}` و `| default`
5. **أعد استخدام المكونات** - ضعها في مجلد `ui/`
6. **استخدم Blocks** - للمحتوى القابل للتكرار مثل السلايدر والـ FAQ
