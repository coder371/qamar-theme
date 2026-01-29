# لغة القوالب (Qalab)

Qalab هي لغة القوالب المستخدمة في ثيمات قمرة، مبنية على Nunjucks.

## المحتويات

| الملف | المحتوى |
|-------|---------|
| [variables.md](./variables.md) | المتغيرات العامة |
| [filters.md](./filters.md) | الفلاتر |
| [tags.md](./tags.md) | الـ Tags |
| [alpine-integration.md](./alpine-integration.md) | تكامل Alpine.js |

---

## نظرة عامة

### الملفات

ملفات القوالب تستخدم امتداد `.njk` (Nunjucks).

### الصيغة الأساسية

```nunjucks
{# تعليق #}

{{ variable }}                    {# طباعة متغير #}
{{ variable | filter }}           {# متغير مع فلتر #}

{% if condition %}                {# شرط #}
{% endif %}

{% for item in items %}           {# حلقة #}
{% endfor %}
```

---

## المتغيرات الرئيسية

| المتغير | الوصف |
|---------|-------|
| `store` | بيانات المتجر |
| `cart` | بيانات السلة |
| `wishlist` | بيانات المفضلة |
| `localization` | بيانات الترجمة والعملة |
| `settings` | إعدادات الثيم |
| `widget.data` | إعدادات الويدجت |
| `widget.blocks` | الـ Blocks |

---

## الفلاتر الأساسية

| الفلتر | الوصف |
|--------|-------|
| `money` | عرض السعر مع العملة |
| `assets` | رابط ملف من assets |
| `default` | قيمة افتراضية |

---

## الـ Tags الأساسية

| Tag | الوصف |
|-----|-------|
| `{% seo %}` | إدراج SEO meta tags |
| `{% qumra_head %}` | موارد قمرة في head |
| `{% qumra_scripts %}` | سكربتات قمرة |
| `{% template "name" %}` | إدراج قالب |
| `{% content %}` | محتوى الصفحة |
| `{% ui "file.njk" %}` | إدراج مكون UI |
| `{{t("key")}}` | ترجمة |

---

## المكتبات الخارجية (يدوية)

> **مهم**: المكتبات التالية يجب استدعاؤها يدوياً في Layout:

| المكتبة | النوع | الاستخدام |
|---------|-------|-----------|
| **Tailwind CSS** | CSS/JS | التنسيق |
| **Google Fonts** | CSS | الخطوط |
| **Alpine.js** | JS | التفاعل |
| **Swiper.js** | CSS/JS | السلايدرات |
| **GLightbox** | CSS/JS | معرض الصور |
| **Animate.css** | CSS | الحركات |

راجع [layouts.md](../theme-structure/layouts.md) للتفاصيل الكاملة.
