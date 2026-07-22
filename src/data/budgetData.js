export const TOTAL_BUDGET = 673;
export const CURRENT_DEFICIT = 2.5;
export const GDP = 2420; // תחזית תמ"ג 2027

// severity: "normal" | "warning" | "critical"
export const CATEGORIES = [
  {
    id: "defense",
    label: "ביטחון וצבא",
    emoji: "🛡️",
    color: "#ef4444",   // red
    current: 123,
    min: 70,
    max: 200,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "חיזבאללה שלח פרחים. 5 מיליארד פחות לביטחון." },
        { threshold: 15, severity: "critical", text: "15 מיליארד קיצוץ. כיפת ברזל? כיפת אלומיניום." },
        { threshold: 30, severity: "critical", text: "קיצוץ דרמטי של 30 מיליארד שקל. אולי בכל זאת השלום מתחיל בתוכנו?" },
        { threshold: 50, severity: "critical", text: "חצי מתקציב הביטחון הלך. תוכניות הצטיידות נבלמות, המחסנים מתרוקנים" },
      ],
      increase: [
        { threshold: 10, severity: "normal",  text: "10 מיליארד שקל נוספים. בתעשיות הביטחוניות חוגגים." },
        { threshold: 30, severity: "warning", text: "עוד 30 מיליארד שקל בדרך. לארוז לך עשרות מטוסי F-35?" },
        { threshold: 50, severity: "warning", text: "50 מיליארד שקל. בקריה עוברים מקוסקוס לכבד אווז" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 10, items: ["מטוסי קרב נוספים", "כיפות ברזל נוספות", "חיל הים מחוזק"] },
        { threshold: 30, items: ["ישראל בין 5 המעצמות הצבאיות", "יתרון טכנולוגי מוחץ", "הרתעה אמיתית"] },
        { threshold: 50, items: ["הצבא החזק ביחס לגודלו בעולם", "ציוד מהמאה ה-22", "שום שכן לא ינסה"] },
      ],
      decrease: [
        { threshold: -5,  items: ["ציוד פחות מתוחזק", "אימונים מצומצמים", "מאגר מילואים קטן"] },
        { threshold: -15, items: ["כיפת ברזל מצומצמת", "פחות כלי טיס פעילים", "גדודים קטנים יותר"] },
        { threshold: -30, items: ["ירידה חדה בהרתעה", "תלות גבוהה בסיוע אמריקאי", "ביטחון דק מאוד"] },
        { threshold: -50, items: ["צבא שלד", "כמעט אין תקציב ציוד", "שמים תקווה בשלום"] },
      ],
    },
  },
  {
    id: "national_security",
    label: "ביטחון לאומי",
    emoji: "🚔",
    color: "#fb923c",   // orange (was dark-red, too similar to defense)
    current: 27,
    min: 15,
    max: 45,
    insights: {
      decrease: [
        { threshold: 3,  severity: "warning",  text: "חייגתם 100? אל תנתקו, זה עלול לקחת זמן" },
        { threshold: 8,  severity: "critical", text: "8 מיליארד שקל פחות, העבריינים עובדים שעות נוספות" },
        { threshold: 12, severity: "critical", text: "ירידה חדה בביטחון הפנים. מפחיד להסתובב בלילה" },
      ],
      increase: [
        { threshold: 5,  severity: "normal", text: "המשטרה מגייסת אלפי שוטרים חדשים. השוטר אזולאי - הקאמבק?" },
        { threshold: 12, severity: "normal", text: "הפקק בבתי הכלא משתחרר - אלפי מקומות כליאה חדשים" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["1,000 שוטרים חדשים", "ניידות מודרניות", "תגובה מהירה יותר"] },
        { threshold: 12, items: ["שכר שוטרים מתוקן", "בתי סוהר משופצים", "מעצרים יעילים יותר"] },
      ],
      decrease: [
        { threshold: -3,  items: ["פחות ניידות בשטח", "תגובה איטית יותר לאירועים", "עומס על הכוחות"] },
        { threshold: -8,  items: ["קיצוץ בסוהרים", "עומס חריג בבתי הסוהר", "פגיעה בחקירות"] },
        { threshold: -12, items: ["ביטחון פנים בשפל", "אסירים בצפיפות קיצונית", "פשיעה מזנקת"] },
      ],
    },
  },
  {
    id: "education",
    label: "חינוך והשכלה גבוהה",
    emoji: "📚",
    color: "#3b82f6",
    current: 127,
    min: 80,
    max: 210,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "5,000 מורים פחות, 40 תלמידים בכיתה התרגלו להיות לבד" },
        { threshold: 15, severity: "critical", text: "ילדים לא צריכים ספרים. יש TikTok" },
        { threshold: 25, severity: "critical", text: "רבע מתקציב החינוך נמחק. המורה לספורט מציע: קחו כדור" },
        { threshold: 40, severity: "critical", text: "מחלקות מחקר נסגרות. הדור הבא של החוקרים? אמריקאים" },
      ],
      increase: [
        { threshold: 5,  severity: "normal", text: "5,000 מורים חדשים - ולכולם יש עיניים בגב" },
        { threshold: 15, severity: "normal", text: "יום לימודים ארוך לתלמידי ישראל. ההורים בוכים מאושר" },
        { threshold: 35, severity: "normal", text: "תקציב ההשכלה הגבוהה מזנק כמעט פי 4. בריחת מוחות? לישראל" },
        { threshold: 55, severity: "normal", text: "מחזירים עטרה ליושנה: ישראל מסתערת על צמרת המחקר העולמית" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["10,000 מורים חדשים", "כיתות קטנות יותר", "ספרים לכל ילד"] },
        { threshold: 15, items: ["יום לימודים ארוך לכולם", "שכר מורים הוגן", "מחשבים לכל כיתה"] },
        { threshold: 35, items: ["20,000 מלגות לסטודנטים", "שכר לימוד מוזל", "מחקר ומפגשי הייטק"] },
        { threshold: 55, items: ["פרופסורים חוזרים מחו\"ל", "ישראל בטופ-20 אוניברסיטאות", "מוחות נשארים בארץ"] },
      ],
      decrease: [
        { threshold: -5,  items: ["5,000 מורים פחות", "ספרים ישנים וקרועים", "כיתות צפופות יותר"] },
        { threshold: -15, items: ["סגירת מסגרות חינוך", "ילדים עם צרכים מיוחדים ללא תמיכה", "TikTok מחליף ספרי לימוד"] },
        { threshold: -25, items: ["שכר לימוד קפץ 25%", "20,000 אקדמאים עוזבים", "ברלין שמחה"] },
        { threshold: -40, items: ["מחלקות מחקר נסגרות", "חינוך איכותי רק לעשירים", "אקזודוס אקדמי"] },
      ],
    },
  },
  {
    id: "health",
    label: "בריאות",
    emoji: "🏥",
    color: "#10b981",
    current: 69,
    min: 42,
    max: 115,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "המתנה לרופא מומחה עלתה ל-5 חודשים. נסה אספירין" },
        { threshold: 12, severity: "critical", text: "כמעט חמישית מתקציב משרד הבריאות נמחק. בהצלחה בחורף" },
        { threshold: 20, severity: "critical", text: "ישראל חוזרת לרמת בריאות של שנות ה-90. נוסטלגיה אמיתית." },
        { threshold: 27, severity: "critical", text: "העיקר הבריאות? עם קיצוץ כזה התשובה היא לא" },
      ],
      increase: [
        { threshold: 5,  severity: "normal", text: "תוספת של אלפי מיטות אשפוז יוצאת לדרך. הפעם לא במסדרון" },
        { threshold: 15, severity: "normal", text: "הרחבה דרמטית - פי 10 - של התוכנית הלאומית לבריאות הנפש" },
        { threshold: 30, severity: "normal", text: "ישראל מתקרבת לממוצע ה-OECD בהוצאה לאומית לבריאות" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["1,200 מיטות אשפוז חדשות", "תור לרופא תוך שבוע", "ציוד רפואי מתקדם"] },
        { threshold: 15, items: ["רפואת שיניים בסל הבריאות", "פסיכיאטריה נגישה לכולם", "רופא משפחה אמיתי"] },
        { threshold: 30, items: ["ממוצע OECD — לראשונה", "מיטות ICU כמו גרמניה", "המתנה פחות מחודש"] },
      ],
      decrease: [
        { threshold: -5,  items: ["תור לרופא מומחה — 5 חודשים", "פחות תרופות בסל", "קופות חולות חלשות"] },
        { threshold: -12, items: ["20 מחלקות אשפוז נסגרות", "רופאים עוזבים לחו\"ל", "ביטוח פרטי הפך הכרחי"] },
        { threshold: -20, items: ["חדרי מיון עמוסים ב-300%", "תמותה הניתנת למניעה עולה", "ישראל 1990"] },
        { threshold: -27, items: ["משבר בריאות לאומי", "הצלת חיים בהגרלה", "CNN מדווח מישראל"] },
      ],
    },
  },
  {
    id: "welfare",
    label: "רווחה ועוני",
    emoji: "👴",
    color: "#f59e0b",
    current: 95,
    min: 60,
    max: 140,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "הנכים דורשים עדכון של הקצבאות – מאיפה יגיע הכסף?" },
        { threshold: 15, severity: "critical", text: "תקציב הליבה של משרד הרווחה נמחק. ילדים בסיכון? תתמודדו" },
        { threshold: 25, severity: "critical", text: 'מי צריך רווחה כשאפשר בלי? באוצר קוראים לזה - "שינוי מבני"' },
      ],
      increase: [
        { threshold: 5,  severity: "normal", text: "קצבת הנכות עולה ב-15%. עוד 700 שקל בדיוק למי שצריך" },
        { threshold: 18, severity: "normal", text: "הגידו כן לזקן! קצבת הזקנה גדלה בכ־1,200 שקל בחודש" },
        { threshold: 30, severity: "normal", text: "קפיצה היסטורית! ישראל מצמצמת את הפער ממדינות הרווחה של ה־OECD" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["קצבת נכות גבוהה ב-15%", "תמיכה לחד-הוריות", "מרכזי שיקום נוספים"] },
        { threshold: 18, items: ["פנסיית זקנה בסיסית לכולם", "קצבת קיום אמיתית", "ניצולי שואה מטופלים"] },
        { threshold: 30, items: ["הכנסה בסיסית מובטחת", "אוכל לכל ילד", "עוני בחצי ממה שיש היום"] },
      ],
      decrease: [
        { threshold: -5,  items: ["קיצוץ בקצבאות נכות", "פחות מרכזי שיקום", "הזקנים ישלמו את המחיר"] },
        { threshold: -15, items: ["ביטול מענקים לחד-הוריות", "עולים ללא סיוע קליטה", "עוני גלוי יותר"] },
        { threshold: -25, items: ["שינוי מבני בזכאות", "ניצולי שואה ללא כיסוי", "1.5 מיליון ללא רשת ביטחון"] },
        { threshold: -35, items: ["קריסת מערכת הרווחה", "עוני קיצוני מוסתר", "ויתור על השכבות החלשות"] },
      ],
    },
  },
  {
    id: "transit_housing",
    label: "סבסוד תחבורה ציבורית וסיוע בדיור",
    emoji: "🚌",
    color: "#0891b2",
    current: 22,
    min: 10,
    max: 40,
    insights: {
      decrease: [
        { threshold: 3,  severity: "warning",  text: "הנסיעה ברכבת מתייקרת. השכר נשאר בתחנה" },
        { threshold: 8,  severity: "critical", text: "התור לדיור ציבורי מתארך. הזכאים מוותרים על החלום" },
        { threshold: 12, severity: "critical", text: "פרויקט דירה בהנחה נכנס לפריזר. חוזרים לרענן את יד2" },
      ],
      increase: [
        { threshold: 5,  severity: "normal", text: "ההנחות ברב-קו ובאפליקציות מתרחבות. הסטודנטים שמחים. בינתיים" },
        { threshold: 14, severity: "normal", text: "זינוק היסטורי בתדירות של קווי האוטובוס בנגב. הגמלים יוצאים לחל"ת" },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["כרטיסיות מסובסדות", "הנחה לסטודנטים ועובדים", "יותר נסיעות בתחבורה ציבורית"] },
        { threshold: 14, items: ["תחבורה ציבורית זולה לכולם", "סיוע בשכר דירה לצעירים", "פחות פער חברתי"] },
      ],
      decrease: [
        { threshold: -3,  items: ["תעריפי תחבורה עולים", "הסיוע בדיור מצטמצם", "עלות מחיה עולה"] },
        { threshold: -8,  items: ["אוטובוסים יקרים מדי", "צעירים לא יכולים להרשות דיור", "פיזור ערים מוגבר"] },
        { threshold: -12, items: ["תחבורה ציבורית רק לעניים שאין להם ברירה", "משבר דיור מחמיר", "פינוי-בינוי — לעשירים"] },
      ],
    },
  },
  {
    id: "rehabilitation",
    label: "שיקום חבל תקומה והצפון",
    emoji: "🏗️",
    color: "#e879f9",   // fuchsia (was brown, too similar to welfare amber)
    current: 33,
    min: 15,
    max: 65,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "תושבי עוטף עזה ממשיכים לחכות. מה חדש." },
        { threshold: 15, severity: "critical", text: "הבנייה מחדש מואטת. תקומה שאינה קמה." },
        { threshold: 18, severity: "critical", text: "השיקום הופך לחלום. רבים לא יחזרו." },
      ],
      increase: [
        { threshold: 10, severity: "normal", text: "בנייה מחדש מואצת. 10,000 משפחות יוכלו לחזור הביתה." },
        { threshold: 25, severity: "normal", text: "תקומה אמיתית. גם הצפון וגם עוטף רואים עתיד." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 10, items: ["10,000 משפחות חוזרות הביתה", "בנייה מחדש מואצת", "שירותים מתוחזקים"] },
        { threshold: 25, items: ["שיקום מלא של הצפון ועוטף", "תשתיות חדשות", "קהילות חזקות מחדש"] },
      ],
      decrease: [
        { threshold: -5,  items: ["עיכוב בחזרת המפונים", "בנייה איטית יותר", "קהילות ממתינות"] },
        { threshold: -15, items: ["שיקום חלקי בלבד", "תושבים שנשארו מחוץ לבתיהם", "אזורים נטושים"] },
        { threshold: -18, items: ["ויתור על שיקום מלא", "הגירה פנימית גוברת", "חבל תקומה — ללא תקומה"] },
      ],
    },
  },
  {
    id: "infrastructure",
    label: "תחבורה ותשתיות",
    emoji: "🚇",
    color: "#8b5cf6",
    current: 40,
    min: 20,
    max: 80,
    insights: {
      decrease: [
        { threshold: 5,  severity: "warning",  text: "המטרו מתעכב 3 שנים. תל אביב תמשיך להיות פקק בינלאומי." },
        { threshold: 12, severity: "critical", text: "הקפאת רכבת קלה. הנסיעה מאשדוד לת\"א תישאר 3 שעות." },
        { threshold: 20, severity: "critical", text: "ישראל תחתית OECD בתחבורה ציבורית. כמו תמיד. לנצח." },
      ],
      increase: [
        { threshold: 10, severity: "normal", text: "מטרו מוקדם בשנתיים. אולי." },
        { threshold: 25, severity: "normal", text: "רכבת מהירה ת\"א–ירושלים ב-30 דק. ציביליזציה!" },
        { threshold: 40, severity: "normal", text: "ישראל תגיע לממוצע אירופה בתחבורה. בערך ב-2040." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 10, items: ["מטרו ת\"א מוקדם בשנתיים", "רכבת קלה חדשה", "פחות פקק בכבישים"] },
        { threshold: 25, items: ["רכבת ת\"א–ירושלים ב-30 דק'", "מטרו חיפה מתחיל", "אוטובוסים חשמליים"] },
        { threshold: 40, items: ["ממוצע אירופה בתחבורה", "פקק? מושג של העבר", "תחבורה ציבורית 24/7"] },
      ],
      decrease: [
        { threshold: -5,  items: ["מטרו מתעכב 3 שנים", "תחבורה ציבורית מצומצמת", "עוד תחנות נסגרות"] },
        { threshold: -12, items: ["הקפאת רכבת קלה", "כבישים לא מתוחזקים", "ת\"א–אשדוד = 3 שעות"] },
        { threshold: -20, items: ["תחתית OECD בתחבורה", "ירידה בבטיחות כבישים", "שום דבר לא מתקדם"] },
      ],
    },
  },
  {
    id: "economy",
    label: "חקלאות, תיירות ותעשיה",
    emoji: "🏭",
    color: "#a3e635",   // lime (was dark-green, too similar to health emerald)
    current: 8,
    min: 4,
    max: 18,
    insights: {
      decrease: [
        { threshold: 2, severity: "warning",  text: "חקלאים מוותרים. ירקות מיובאים. ישראל? אה כן." },
        { threshold: 4, severity: "critical", text: "תיירות ותעשייה ישלמו. הצמיחה — לא." },
      ],
      increase: [
        { threshold: 3, severity: "normal", text: "תמיכה בחקלאות ותעשייה. אפשר לגדל קיווי בנגב." },
        { threshold: 8, severity: "normal", text: "ישראל מושכת תיירים ומפעלים. השקל מרוצה." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 3, items: ["תמיכה בחקלאים", "תיירות מוזלת לישראלים", "מפעלים שנשארים בארץ"] },
        { threshold: 8, items: ["ישראל יעד תיירותי מוביל", "תעשייה מקומית חזקה", "עצמאות מזון גבוהה"] },
      ],
      decrease: [
        { threshold: -2, items: ["חקלאים זורקים את המטע", "תיירים פחות — הכנסות פחות", "ייבוא מחליף תוצרת מקומית"] },
        { threshold: -4, items: ["תעשייה מקומית נחלשת", "חקלאות בשפל", "תלות גוברת בייבוא"] },
      ],
    },
  },
  {
    id: "government",
    label: "רשויות מקומיות וממשל",
    emoji: "🏛️",
    color: "#64748b",
    current: 26,
    min: 15,
    max: 45,
    insights: {
      decrease: [
        { threshold: 3, severity: "warning",  text: "3,000 פחות פקידים. ומי יאשר לך את הבנייה? אחד." },
        { threshold: 6, severity: "warning",  text: "ממשלה רזה. הרישוי לגן שלך? 3 שנים. במקרה הטוב." },
        { threshold: 11, severity: "critical", text: "הממשל כמעט לא קיים. אנרכיה? לא. פשוט עוד בירוקרטיה, רק ללא תקציב." },
      ],
      increase: [
        { threshold: 4, severity: "normal", text: "3,000 עובדי מדינה נוספים. שורות קצרות יותר? אולי." },
        { threshold: 10, severity: "normal", text: "דיגיטציה מלאה של שירותי הממשלה. בעשר שנה מישהו ישתמש." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 4,  items: ["שורות קצרות יותר", "אישורים מהירים יותר", "שירות ציבורי שעובד"] },
        { threshold: 10, items: ["דיגיטציה מלאה של הממשל", "שירות ממשלתי 24/7", "מודל אסטוניה"] },
      ],
      decrease: [
        { threshold: -3,  items: ["3,000 פחות פקידים", "אישור בנייה — שנתיים", "בירוקרטיה ללא תקציב"] },
        { threshold: -6,  items: ["ממשלה שלא פועלת", "רישיון עסק — שנה וחצי", "עצמאים? לא שווה"] },
        { threshold: -11, items: ["ממשל מינימלי בפועל", "שירותים ציבוריים בקריסה", "כאוס מאורגן"] },
      ],
    },
  },
];

// הוצאות קבועות שאינן מופיעות במשחק (ריבית, רשות האוכלוסין, סעיפים אחרים)
// סה"כ תקציב = 570 (סליידרים) + 103 (אחר) = 673 מיליארד
// גירעון ברירת מחדל: (673 - 613) / 2420 * 100 = 2.5%
const OTHER_SPENDING = 103;

// מה כולל התקציב — לפי הרקע שנכתב לכל קטגוריה
export const CATEGORY_BREAKDOWN = {
  defense: [
    "משרד הביטחון",
    "השב\"כ והמוסד",
    "חוק חיילים משוחררים",
  ],
  national_security: [
    "משטרה",
    "שירות בתי הסוהר",
  ],
  education: [
    "משרד החינוך",
    "מדע, טכנולוגיה ותרבות",
    "השכלה גבוהה",
  ],
  health: [
    "מימון סל שירותי הבריאות",
    "העברות לקופות החולים",
    "תמיכה בבתי החולים הציבוריים",
    "רכש שירותי בריאות מגופים אחרים",
  ],
  welfare: [
    "משרד הרווחה",
    "ביטוח לאומי",
    "הרשות לזכויות ניצולי השואה",
    "משרד העלייה",
  ],
  transit_housing: [
    "סבסוד כרטיסיות נסיעה בתחבורה הציבורית",
    "עמידר ועמיגור (דיור ציבורי)",
    "סיוע בשכר דירה",
  ],
  rehabilitation: [
    "מנהלת תקומה",
    "שיקום יישובי הצפון",
    "פיצויים ומענקים לתושבים מפונים",
    "שיקום עסקים שנפגעו מהמלחמה",
  ],
  infrastructure: [
    "כבישים",
    "רכבות",
    "תשתיות אנרגיה ומים",
    "משרד הבינוי והשיכון (ללא סבסוד דיור)",
  ],
  economy: [
    "משרד הכלכלה והתעשייה",
    "משרד החקלאות",
    "הגנת הסביבה",
    "תיירות",
    "תקשורת",
  ],
  government: [
    "רשויות מקומיות",
    "משרד רה\"מ",
    "משרד המשפטים",
    "משרד האוצר",
    "משרד החוץ",
    "הכנסת",
    "מבקר המדינה",
  ],
};

export function getHighlights(category, delta) {
  if (Math.abs(delta) < 2) return null;
  const list = delta < 0 ? category.highlights?.decrease : category.highlights?.increase;
  if (!list) return null;
  const absDelta = Math.abs(delta);
  let best = null;
  for (const item of list) {
    if (absDelta >= Math.abs(item.threshold)) best = item;
  }
  return best ?? null;
}

export function getInsight(category, delta) {
  if (Math.abs(delta) < 1) return null;
  const list = delta < 0 ? category.insights.decrease : category.insights.increase;
  const absDelta = Math.abs(delta);
  let best = null;
  for (const item of list) {
    if (absDelta >= Math.abs(item.threshold)) best = item;
  }
  return best ?? null;
}

export function calcDeficit(values) {
  const totalSpend =
    Object.values(values).reduce((a, b) => a + b, 0) + 103;
  const revenue = 613; // הכנסות המדינה הצפויות לשנת 2027
  return ((totalSpend - revenue) / GDP * 100).toFixed(1);
}
