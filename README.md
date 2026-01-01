# Smartpone Website

אתר אינטרנט עבור חברת Smartpone - שירותי תקשורת לעובדים זרים

## התקנה

1. התקן את החבילות הנדרשות:
```bash
npm install
```

2. הפעל את שרת הפיתוח:
```bash
npm run dev
```

3. פתח את הדפדפן בכתובת: `http://localhost:5173`

## מבנה הפרויקט

- `src/pages/` - עמודים שונים של האתר
  - `Home.jsx` - עמוד הבית
  - `About.jsx` - עמוד אודות
  - `Contact.jsx` - עמוד צור קשר
  - `Products.jsx` - עמוד מוצרים
  - `Gallery.jsx` - עמוד גלריה

- `src/components/` - קומפוננטות
  - `Navigation.jsx` - תפריט ניווט
  - `ImageCarousel.jsx` - תמונות מתחלפות

- `public/images/` - תיקיית תמונות (הוסף כאן את התמונות והלוגו)

## הוספת תמונות

1. העלה את הלוגו שלך לתיקייה `public/` בשם `logo-placeholder.png` (או שנה את השם בקוד)
2. העלה תמונות לעמוד הבית לתיקייה `public/images/`:
   - `placeholder-1.jpg`
   - `placeholder-2.jpg`
   - `placeholder-3.jpg`
   - `about-placeholder.jpg`

## בנייה לפרודקשן

```bash
npm run build
```

הקבצים יבנו לתיקייה `dist/`








