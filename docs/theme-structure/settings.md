# إعدادات الثيم (Settings)

إعدادات الثيم تتيح للمستخدمين تخصيص المظهر من لوحة التحكم.

## الموقع

```
settings/
├── settings-schema.json      # تعريف الإعدادات المتاحة
├── settings-data.json        # القيم الفعلية للإعدادات
└── templates-settings.json   # ترتيب عرض القوالب
```

---

## settings-schema.json

يحدد الإعدادات المتاحة للتخصيص.

### البنية

```json
[
  {
    "label": {
      "ar": "إعدادات المظهر",
      "en": "Appearance Settings"
    },
    "settings": {
      "mainColor": {
        "type": "color",
        "label": "اللون الرئيسي",
        "default": "#ff0000"
      }
    }
  }
]
```

### مثال كامل

```json
[
  {
    "label": {
      "ar": "الألوان",
      "en": "Colors"
    },
    "settings": {
      "mainColor": {
        "type": "color",
        "label": "اللون الرئيسي",
        "default": "#3b82f6"
      },
      "secondaryColor": {
        "type": "color",
        "label": "اللون الثانوي",
        "default": "#64748b"
      },
      "backgroundColor": {
        "type": "color",
        "label": "لون الخلفية",
        "default": "#ffffff"
      }
    }
  },
  {
    "label": {
      "ar": "الخطوط",
      "en": "Fonts"
    },
    "settings": {
      "fontFamily": {
        "type": "select",
        "label": "نوع الخط",
        "default": "cairo",
        "options": [
          { "value": "cairo", "label": "Cairo" },
          { "value": "tajawal", "label": "Tajawal" },
          { "value": "almarai", "label": "Almarai" }
        ]
      },
      "fontSize": {
        "type": "range",
        "label": "حجم الخط",
        "default": 16,
        "min": 12,
        "max": 24,
        "step": 1,
        "unit": "px"
      }
    }
  },
  {
    "label": {
      "ar": "الإعلانات",
      "en": "Announcements"
    },
    "settings": {
      "announcementEnabled": {
        "type": "boolean",
        "label": "تفعيل شريط الإعلانات",
        "default": true
      },
      "announcementText": {
        "type": "string",
        "label": "نص الإعلان",
        "default": "توصيل مجاني للطلبات فوق 50 دينار"
      }
    }
  },
  {
    "label": {
      "ar": "كود مخصص",
      "en": "Custom Code"
    },
    "settings": {
      "customCSS": {
        "type": "css",
        "label": "CSS مخصص",
        "default": ""
      },
      "customJS": {
        "type": "javascript",
        "label": "JavaScript مخصص",
        "default": ""
      }
    }
  }
]
```

---

## أنواع الحقول

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
| `css` | محرر CSS | — |
| `javascript` | محرر JavaScript | — |
| `menu` | قائمة روابط | — |
| `products` | منتجات | — |

---

## استخدام الإعدادات في القوالب

### في layout.njk

```nunjucks
<style>
  :root {
    --mainColor: {{ settings.mainColor }};
    --secondaryColor: {{ settings.secondaryColor }};
    --backgroundColor: {{ settings.backgroundColor }};
    --fontFamily: {{ settings.fontFamily }}, sans-serif;
    --fontSize: {{ settings.fontSize }}px;
  }
</style>

{% if settings.customCSS %}
<style>
  {{ settings.customCSS | safe }}
</style>
{% endif %}
```

### في الويدجات

```nunjucks
{% if settings.announcementEnabled %}
<div class="announcement-bar" style="background-color: {{ settings.mainColor }}">
  {{ settings.announcementText }}
</div>
{% endif %}
```

---

## settings-data.json

يحفظ القيم الفعلية للإعدادات (يتم تحديثه تلقائياً من لوحة التحكم).

```json
{
  "mainColor": "#3b82f6",
  "secondaryColor": "#64748b",
  "announcementEnabled": true,
  "announcementText": "خصم 20% على جميع المنتجات"
}
```

---

## templates-settings.json

يحدد ترتيب عرض القوالب.

```json
{
  "templates_order": ["header", "main", "footer"]
}
```
