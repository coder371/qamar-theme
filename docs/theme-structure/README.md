# بنية الثيم

المجلدات والملفات الأساسية لثيم قمرة.

## المحتويات

| الملف | المحتوى |
|-------|---------|
| [layouts.md](./layouts.md) | التخطيطات |
| [pages.md](./pages.md) | الصفحات |
| [widgets.md](./widgets.md) | الويدجات |
| [templates.md](./templates.md) | القوالب |
| [settings.md](./settings.md) | الإعدادات |
| [locales.md](./locales.md) | الترجمة |
| [assets.md](./assets.md) | الأصول |
| [ui-components.md](./ui-components.md) | مكونات UI |
| [frontend-libraries.md](./frontend-libraries.md) | مكتبات الفرونت إند |
| [javascript.md](./javascript.md) | JavaScript Utilities |

---

## الهيكل الكامل

```
my-theme/
├── .qumra/
│   └── qumra.config.json      # تكوين الثيم
│
├── assets/                     # CSS, JS, Media
│   ├── style.css
│   ├── main.js
│   └── images/
│
├── layouts/                    # تخطيطات الصفحات
│   └── layout.njk
│
├── locales/                    # ملفات الترجمة
│   ├── ar.json
│   ├── en.json
│   └── fr.json
│
├── pages/                      # تعريفات الصفحات
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   └── ...
│
├── settings/                   # إعدادات الثيم
│   ├── settings-schema.json
│   ├── settings-data.json
│   └── templates-settings.json
│
├── templates/                  # القوالب المشتركة
│   ├── header.json
│   ├── footer.json
│   └── global.json
│
├── ui/                         # مكونات UI
│   ├── sidebar.njk
│   ├── search.njk
│   └── cart.njk
│
└── widgets/                    # الويدجات
    └── widget-name/
        ├── schema.json
        └── widget.njk
```

---

## التقنيات

| التقنية | الاستخدام | ملاحظة |
|---------|----------|--------|
| **Nunjucks** | لغة القوالب (.njk) | - |
| **Tailwind CSS** | إطار CSS | يدوي |
| **Alpine.js** | التفاعل | يدوي |
| **Google Fonts** | الخطوط | يدوي |
| **Swiper.js** | السلايدرات | يدوي |
| **JSON** | الإعدادات | - |

> **مهم**: المكتبات المحددة بـ "يدوي" يجب استدعاؤها في الـ Layout. راجع [frontend-libraries.md](./frontend-libraries.md)
