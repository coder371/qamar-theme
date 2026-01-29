# إضافة VS Code

إضافة VS Code لتطوير ثيمات قمرة بشكل أسرع.

## التثبيت

### عبر سوق VS Code

1. افتح VS Code
2. اذهب إلى Extensions (Ctrl+Shift+X)
3. ابحث عن "Qalab"
4. اضغط Install

**أو** زر الرابط مباشرة:
[Qumra Qalab Extension](https://marketplace.visualstudio.com/items?itemName=Qumra.qalab)

### عبر سطر الأوامر

1. افتح VS Code
2. اضغط `Ctrl+P` (Windows/Linux) أو `Cmd+P` (Mac)
3. الصق الأمر التالي:

```
ext install Qumra.qalab
```

---

## المميزات

### 1. الإكمال التلقائي (Autocomplete)

اقتراحات ذكية أثناء الكتابة:
- Tags قمرة (`{% seo %}`, `{% template %}`, etc.)
- Filters (`| money`, `| assets`, etc.)
- المتغيرات العامة (`store`, `cart`, `wishlist`, `localization`)

### 2. تمييز الصيغة (Syntax Highlighting)

تلوين الكود لملفات `.njk`:
- Tags Nunjucks
- Filters
- المتغيرات
- HTML
- التعليقات

### 3. مقاطع الكود الجاهزة (Snippets)

اختصارات سريعة للكود الشائع:

| الاختصار | الناتج |
|----------|--------|
| `qseo` | `{% seo %}` |
| `qhead` | `{% qumra_head %}` |
| `qscripts` | `{% qumra_scripts %}` |
| `qtemplate` | `{% template "name" %}` |
| `qcontent` | `{% content %}` |
| `qui` | `{% ui "file.njk" %}` |
| `qfor` | حلقة for كاملة |
| `qif` | شرط if كامل |

---

## إعداد الملفات

للحصول على أفضل تجربة، تأكد من ربط ملفات `.njk` بـ Nunjucks:

1. افتح أي ملف `.njk`
2. اضغط على نوع اللغة في شريط الحالة (أسفل اليمين)
3. اختر "Nunjucks" أو "Configure File Association"

أو أضف في `settings.json`:

```json
{
  "files.associations": {
    "*.njk": "nunjucks"
  }
}
```

---

## نصائح

1. **فعّل Auto Save** لمعاينة التغييرات فوراً مع `qumra theme dev`
2. **استخدم Snippets** لكتابة الكود بشكل أسرع
3. **راجع الاقتراحات** (Ctrl+Space) للتعرف على المتغيرات والـ filters المتاحة
