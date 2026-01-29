# التثبيت

## متطلبات النظام

- Node.js v16 أو أحدث
- npm أو yarn

## تثبيت Qumra CLI

```bash
npm install -g @aspect2/qumra-cli
```

## تسجيل الدخول

```bash
qumra user login
```

يفتح المتصفح لتسجيل الدخول إلى حساب قمرة.

---

## إضافة VS Code (اختياري)

للحصول على:
- الإكمال التلقائي
- تمييز الصيغة
- مقاطع الكود الجاهزة

### التثبيت

1. افتح VS Code
2. اضغط `Ctrl+P` (أو `Cmd+P` على Mac)
3. الصق:

```
ext install Qumra.qalab
```

أو ابحث عن "Qalab" في Extensions.

---

## التحقق من التثبيت

```bash
qumra --version
```

يجب أن يظهر رقم الإصدار.
