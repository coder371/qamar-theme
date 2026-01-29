# دليل تطوير ثيمات قمرة

دليل شامل لبناء وتطوير الثيمات في منصة قمرة.

## الأقسام

### البدء السريع
- [getting-started/](./getting-started/) - التثبيت وإنشاء أول ثيم

### بنية الثيم
- [theme-structure/](./theme-structure/) - المجلدات والملفات الأساسية

### لغة القوالب
- [qalab/](./qalab/) - المتغيرات والفلاتر والـ Tags

### Store AJAX API
- [store-ajax/](./store-ajax/) - واجهة برمجية للسلة والمفضلة والبحث

### الأدوات
- [tools/](./tools/) - CLI و VS Code Extension

### أمثلة
- [examples/](./examples/) - أمثلة عملية جاهزة

---

## التقنيات المستخدمة

| التقنية | الاستخدام | ملاحظة |
|---------|----------|--------|
| **Nunjucks (.njk)** | لغة القوالب | - |
| **Tailwind CSS** | تنسيق الأنماط | يدوي |
| **Alpine.js** | التفاعل والـ state | يدوي |
| **Swiper.js** | السلايدرات | يدوي |
| **GLightbox** | معرض الصور | يدوي |
| **Google Fonts** | الخطوط (Tajawal, Poppins) | يدوي |
| **Animate.css** | الحركات | اختياري |
| **JSON** | الإعدادات والصفحات | - |

> **ملاحظة مهمة**: جميع مكتبات الفرونت إند والخطوط يجب استدعاؤها يدوياً في الـ Layout. راجع [layouts.md](./theme-structure/layouts.md) للتفاصيل.

### روابط CDN للمكتبات

```html
<!-- CSS في <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">

<!-- JavaScript في <body> -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>
```

---

## البدء السريع

```bash
# تثبيت CLI
npm install -g @aspect2/qumra-cli

# تسجيل الدخول
qumra user login

# إنشاء ثيم جديد
qumra theme new

# تشغيل خادم التطوير
qumra theme dev

# نشر الثيم
qumra theme publish
```

---

## الموارد الخارجية

- [التوثيق الرسمي](https://docs.qumra.cloud/docs/theme)
- [إضافة VS Code](https://marketplace.visualstudio.com/items?itemName=Qumra.qalab)
