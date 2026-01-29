# إنشاء أول ثيم

## إنشاء مشروع جديد

```bash
qumra theme new
```

يُنشئ مشروع ثيم جديد مع البنية الأساسية.

---

## تشغيل خادم التطوير

```bash
qumra theme dev
```

يشغل خادم محلي لمعاينة الثيم مع إعادة التحميل التلقائي.

---

## البنية الأساسية

بعد إنشاء الثيم:

```
my-theme/
├── .qumra/
│   └── qumra.config.json
├── assets/
│   ├── style.css
│   └── main.js
├── layouts/
│   └── layout.njk
├── locales/
│   └── ar.json
├── pages/
│   └── index.json
├── settings/
│   └── settings-schema.json
├── templates/
│   ├── header.json
│   └── footer.json
├── ui/
└── widgets/
```

---

## إنشاء أول ويدجت

```bash
qumra gen widget hero-banner
```

يُنشئ:
```
widgets/
└── hero-banner/
    ├── schema.json
    └── widget.njk
```

---

## نشر الثيم

```bash
qumra theme publish
```

---

## الخطوات التالية

1. تعرف على [بنية الثيم](../theme-structure/)
2. تعلم [لغة القوالب](../qalab/)
3. استكشف [الأمثلة](../examples/)
