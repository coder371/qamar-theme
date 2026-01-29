# القوالب (Templates)

القوالب هي مناطق قابلة لإعادة الاستخدام تجمع الويدجات في مجموعات منطقية تظهر في كل صفحة.

## الموقع

```
templates/
├── header.json    # رأس الصفحة
├── footer.json    # تذييل الصفحة
└── global.json    # عناصر عامة (اختياري)
```

---

## الاستخدامات الشائعة

| القالب | الاستخدام |
|--------|----------|
| `header` | شريط الإعلانات، الشعار، القائمة الرئيسية، البحث، السلة |
| `footer` | روابط سريعة، معلومات التواصل، حقوق النشر |
| `global` | عناصر عائمة مثل زر WhatsApp أو العودة للأعلى |

---

## بنية ملف القالب

```json
{
  "title": "اسم القالب",
  "allowAdd": true,
  "allowRemove": true,
  "allowReorder": true,
  "widgets": [
    {
      "name": "header-widget",
      "widget": "header",
      "settings": {}
    }
  ]
}
```

---

## الخصائص

| الخاصية | النوع | الوصف |
|---------|------|-------|
| `title` | نص | اسم العرض في محرر الثيم |
| `allowAdd` | boolean | السماح بإضافة ويدجات جديدة |
| `allowRemove` | boolean | السماح بحذف ويدجات |
| `allowReorder` | boolean | السماح بإعادة ترتيب الويدجات |
| `widgets` | مصفوفة | قائمة الويدجات في القالب |

---

## أمثلة

### header.json

```json
{
  "title": "Header",
  "allowAdd": false,
  "allowRemove": false,
  "allowReorder": false,
  "widgets": [
    {
      "name": "header",
      "widget": "header",
      "settings": {
        "show_top_bar": true,
        "navbar_text": "توصيل مجاني للطلبات فوق 50 دينار",
        "show_search": true,
        "show_cart": true,
        "header_menu": "main-menu"
      }
    }
  ]
}
```

### footer.json

```json
{
  "title": "Footer",
  "allowAdd": true,
  "allowRemove": true,
  "allowReorder": true,
  "widgets": [
    {
      "name": "footer-links",
      "widget": "footer-columns",
      "settings": {}
    },
    {
      "name": "footer-bottom",
      "widget": "footer-copyright",
      "settings": {}
    }
  ]
}
```

### global.json

```json
{
  "title": "Global Elements",
  "allowAdd": true,
  "allowRemove": true,
  "allowReorder": true,
  "widgets": [
    {
      "name": "whatsapp-button",
      "widget": "whatsapp-float",
      "settings": {
        "phone_number": "+96512345678",
        "message": "مرحباً، أحتاج مساعدة"
      }
    },
    {
      "name": "back-to-top",
      "widget": "scroll-top",
      "settings": {}
    }
  ]
}
```

---

## استخدام القوالب في التخطيط

في ملف `layouts/layout.njk`:

```nunjucks
<!DOCTYPE html>
<html>
<head>
  {% seo %}
  {% qumra_head %}
</head>
<body>
  {# قالب الهيدر #}
  {% template "header" %}

  {# محتوى الصفحة #}
  <main>
    {% content %}
  </main>

  {# قالب الفوتر #}
  {% template "footer" %}

  {# العناصر العامة #}
  {% template "global" %}

  {% qumra_scripts %}
</body>
</html>
```

---

## ترتيب القوالب

في `settings/templates-settings.json`:

```json
{
  "templates_order": ["header", "main", "footer", "global"]
}
```

يحدد ترتيب عرض القوالب في الصفحة.
