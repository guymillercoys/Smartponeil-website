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

## Netlify Functions

האתר כולל פונקציות Netlify לאינטגרציה עם Tranzila לתשלומים.

### משתני סביבה נדרשים

על מנת שהפונקציות יעבדו, יש להגדיר את המשתנה הבא:

- `TRANZILA_TERMINAL_NAME` - שם הטרמינל של Tranzila

**הגדרה ב-Netlify:**
1. היכנס ל-Netlify Dashboard
2. בחר את האתר שלך
3. עבור ל-Site settings > Environment variables
4. הוסף משתנה חדש: `TRANZILA_TERMINAL_NAME` עם הערך המתאים

**הגדרה לפיתוח מקומי:**
צור קובץ `.env` בתיקיית השורש של הפרויקט:
```
TRANZILA_TERMINAL_NAME=your_terminal_name
```

### הרצה מקומית

להרצת הפונקציות מקומית, השתמש ב-Netlify CLI:

```bash
# התקן Netlify CLI (אם עדיין לא התקנת)
npm install -g netlify-cli

# הרץ את השרת המקומי
netlify dev
```

השרת יעלה על `http://localhost:8888` (או פורט אחר אם 8888 תפוס).

### בדיקת הפונקציה

לאחר הרצת `netlify dev`, תוכל לבדוק את הפונקציה:

```
GET /.netlify/functions/create-checkout?product=<SKU>
```

דוגמה:
```
http://localhost:8888/.netlify/functions/create-checkout?product=iphone-001
```

הפונקציה תחזיר JSON עם:
- `orderId` - מזהה הזמנה ייחודי
- `product` - פרטי המוצר (SKU, שם, מחיר, מטבע)
- `url` - כתובת ה-iframe של Tranzila לתשלום

### פונקציות זמינות

- `create-checkout` - יוצרת URL של iframe לתשלום עבור מוצר מסוים
- `tranzila-notify` - נקודת קצה לקבלת התראות מ-Tranzila (stub)








