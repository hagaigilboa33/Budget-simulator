export const TOTAL_BUDGET = 700;
export const CURRENT_DEFICIT = 4.9;
export const GDP = 2420; // תחזית תמ"ג 2027

// severity: "normal" | "warning" | "critical"
export const CATEGORIES = [
  {
    id: "defense",
    label: "ביטחון וצבא",
    emoji: "🛡️",
    color: "#ef4444",
    current: 143,
    min: 80,
    max: 200,
    insights: {
      decrease: [
        { threshold: -5,  severity: "warning",  text: "חיזבאללה שלח פרחים. 5 מיליארד פחות לביטחון." },
        { threshold: -15, severity: "critical", text: "15 מיליארד קיצוץ. כיפת ברזל? כיפת אלומיניום." },
        { threshold: -30, severity: "critical", text: "30 מיליארד. נחמד. אולי ננסה שלום בשוק הפעם." },
        { threshold: -50, severity: "critical", text: "חצי תקציב הביטחון. הזכרנו לך שאנחנו במזרח התיכון?" },
      ],
      increase: [
        { threshold: 10,  severity: "normal",   text: "10 מיליארד שקל נוספים. בתעשיות הביטחוניות חוגגים." },
        { threshold: 30,  severity: "warning",  text: "30 מיליארד. ישראל תהיה ה-5 בעולם בהוצאה ביטחונית ביחס לתמ\"ג. בבואה." },
        { threshold: 50,  severity: "warning",  text: "50 מיליארד תוספת. הצבא? עשיר. בתי ספר? לא כל כך." },
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
    id: "education",
    label: "חינוך והשכלה גבוהה",
    emoji: "📚",
    color: "#3b82f6",
    current: 114,
    min: 68,
    max: 185,
    insights: {
      decrease: [
        { threshold: -5,  severity: "warning",  text: "5,000 מורים פחות. אבל הכיתה של 42 ממילא התרגלה לבד." },
        { threshold: -15, severity: "critical", text: "ילדים לא צריכים ספרים. יש TikTok." },
        { threshold: -25, severity: "critical", text: "שכר לימוד עלה 25%. עוד 20,000 אקדמאים יעזבו לברלין." },
        { threshold: -35, severity: "critical", text: "מחלקות מחקר נסגרות. הדור הבא של החוקרים? אמריקאים." },
        { threshold: -50, severity: "critical", text: "עוד קיצוץ בחינוך ומדינת ישראל תפסיק להפתיע. לגמרי." },
      ],
      increase: [
        { threshold: 5,   severity: "normal",   text: "5,000 מורים חדשים. הם יצאו להפגנה בעוד שנה, אבל בינתיים." },
        { threshold: 15,  severity: "normal",   text: "יום לימודים ארוך לכל ישראל. ההורים בוכים משמחה." },
        { threshold: 30,  severity: "normal",   text: "20,000 מלגות לסטודנטים. גם הם ישתמשו בהן כדי לעזוב." },
        { threshold: 50,  severity: "normal",   text: "ישראל שומרת על פרופסורים בארץ. מושג חדש." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["10,000 מורים חדשים", "כיתות קטנות יותר", "ספרים לכל ילד"] },
        { threshold: 15, items: ["יום לימודים ארוך לכולם", "שכר מורים הוגן", "מחשבים לכל כיתה"] },
        { threshold: 30, items: ["20,000 מלגות לסטודנטים", "שכר לימוד מוזל", "מחקר ומפגשי הייטק"] },
        { threshold: 50, items: ["פרופסורים חוזרים מחו\"ל", "ישראל בטופ-20 אוניברסיטאות", "מוחות נשארים בארץ"] },
      ],
      decrease: [
        { threshold: -5,  items: ["5,000 מורים פחות", "ספרים ישנים וקרועים", "כיתות צפופות יותר"] },
        { threshold: -15, items: ["סגירת מסגרות חינוך", "ילדים עם צרכים מיוחדים ללא תמיכה", "TikTok מחליף ספרי לימוד"] },
        { threshold: -25, items: ["שכר לימוד קפץ 25%", "20,000 אקדמאים עוזבים", "ברלין שמחה"] },
        { threshold: -35, items: ["מחלקות מחקר נסגרות", "חינוך איכותי רק לעשירים", "אקזודוס אקדמי"] },
        { threshold: -50, items: ["ויתור על דור שלם", "בי\"ס ציבורי? מי מכיר", "החוקרים הבאים — אמריקאים"] },
      ],
    },
  },
  {
    id: "health",
    label: "בריאות",
    emoji: "🏥",
    color: "#10b981",
    current: 64,
    min: 40,
    max: 110,
    insights: {
      decrease: [
        { threshold: -5,  severity: "warning",  text: "המתנה לרופא מומחה עלתה ל-5 חודשים. נסה אספירין." },
        { threshold: -12, severity: "critical", text: "20 מחלקות אשפוז נסגרות. אל דאגה — פרטי רק 3,000 ₪ לפגישה." },
        { threshold: -20, severity: "critical", text: "ישראל חוזרת לרמת בריאות של שנות ה-90. נוסטלגיה אמיתית." },
        { threshold: -28, severity: "critical", text: "אחרי הקיצוץ הזה, ה-IMF מציע לך לבדוק ביטוח רפואי פרטי." },
      ],
      increase: [
        { threshold: 5,   severity: "normal",   text: "1,200 מיטות אשפוז חדשות. לאנשים שיהיו בהן." },
        { threshold: 15,  severity: "normal",   text: "רופא משפחה שמגיע תוך שבוע. מושג חדשני לישראל." },
        { threshold: 30,  severity: "normal",   text: "ממוצע OECD בבריאות. אחרי 40 שנה של פיגור." },
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
        { threshold: -28, items: ["משבר בריאות לאומי", "הצלת חיים בהגרלה", "CNN מדווח מישראל"] },
      ],
    },
  },
  {
    id: "welfare",
    label: "ביטוח לאומי וקצבאות",
    emoji: "👴",
    color: "#f59e0b",
    current: 64,
    min: 40,
    max: 90,
    insights: {
      decrease: [
        { threshold: -5,  severity: "warning",  text: "קיצוץ בקצבאות. הנכים שלחו מכתב מחאה. לא ענו להם." },
        { threshold: -12, severity: "critical", text: "ניפחת את הגירעון או קצצת לחלשים. בחרת בחלשים. קלאסי." },
        { threshold: -20, severity: "critical", text: "שינוי מבני בזכאות לקצבאות. כלומר — פחות אנשים יקבלו." },
      ],
      increase: [
        { threshold: 5,   severity: "normal",   text: "העלאת קצבת נכות ב-15%. לא מותרות — רק כיסוי קצת יותר טוב." },
        { threshold: 15,  severity: "normal",   text: "פנסיית זקנה בסיסית לכל אזרח. אירופה עושה כבר 50 שנה." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["קצבת נכות גבוהה ב-15%", "תמיכה לחד-הוריות", "מרכזי שיקום נוספים"] },
        { threshold: 15, items: ["פנסיית זקנה בסיסית לכולם", "קצבת קיום אמיתית", "פנסיה כמו באירופה"] },
      ],
      decrease: [
        { threshold: -5,  items: ["קיצוץ בקצבאות נכות", "פחות מרכזי שיקום", "הזקנים ישלמו את המחיר"] },
        { threshold: -12, items: ["ביטול מענקים לחד-הוריות", "זקנים בעוני גלוי", "ויתור על השכבות החלשות"] },
        { threshold: -20, items: ["שינוי מבני בזכאות", "עוני קיצוני מוסתר", "1.2 מיליון ללא רשת ביטחון"] },
      ],
    },
  },
  {
    id: "infrastructure",
    label: "תחבורה ותשתיות",
    emoji: "🚇",
    color: "#8b5cf6",
    current: 45,
    min: 20,
    max: 90,
    insights: {
      decrease: [
        { threshold: -5,  severity: "warning",  text: "המטרו מתעכב 3 שנים. תל אביב תמשיך להיות פקק בינלאומי." },
        { threshold: -15, severity: "critical", text: "הקפאת רכבת קלה. הנסיעה מאשדוד לת\"א תישאר 3 שעות." },
        { threshold: -25, severity: "critical", text: "ישראל תחתית OECD בתחבורה ציבורית. כמו תמיד. לנצח." },
      ],
      increase: [
        { threshold: 10,  severity: "normal",   text: "מטרו מוקדם בשנתיים. אולי." },
        { threshold: 25,  severity: "normal",   text: "רכבת מהירה ת\"א–ירושלים ב-30 דק. ציביליזציה!" },
        { threshold: 40,  severity: "normal",   text: "ישראל תגיע לממוצע אירופה בתחבורה. בערך ב-2040." },
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
        { threshold: -15, items: ["הקפאת רכבת קלה", "כבישים לא מתוחזקים", "ת\"א–אשדוד = 3 שעות"] },
        { threshold: -25, items: ["תחתית OECD בתחבורה", "ירידה בבטיחות כבישים", "שום דבר לא מתקדם"] },
      ],
    },
  },
  {
    id: "social",
    label: "רווחה ועוני",
    emoji: "🤝",
    color: "#ec4899",
    current: 14,
    min: 7,
    max: 35,
    insights: {
      decrease: [
        { threshold: -3,  severity: "warning",  text: "200,000 ילדים בסיכון יסתדרו בלי המדינה. הם רגילים." },
        { threshold: -6,  severity: "critical", text: "מרכזי יום לנוער בסיכון? יש להם את הרחוב." },
        { threshold: -9,  severity: "critical", text: "ישראל כבר בין המדינות עם אחוז עוני הכי גבוה ב-OECD. מה עוד?" },
      ],
      increase: [
        { threshold: 5,   severity: "normal",   text: "80,000 משפחות מתחת לקו העוני פחות. יש דברים שאפשר למדוד." },
        { threshold: 12,  severity: "normal",   text: "הכנסה בסיסית מובטחת. שמאל? ימין? לאנשים זה לא משנה." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 5,  items: ["80,000 משפחות פחות בעוני", "מרכזי יום לנוער בסיכון", "עובדים סוציאליים בכל שכונה"] },
        { threshold: 12, items: ["הכנסה בסיסית מובטחת", "אוכל לכל ילד", "עוני בחצי ממה שיש היום"] },
      ],
      decrease: [
        { threshold: -3, items: ["200,000 ילדים בסיכון ללא תמיכה", "מרכזי יום נסגרים", "הרחוב כמסגרת"] },
        { threshold: -6, items: ["עלייה חדה באלימות נוער", "עוני קיצוני מוסתר", "תחתית OECD בעוני"] },
        { threshold: -9, items: ["שיא עוני — רשמי", "ילדים בסיכון ללא כיסוי", "ויתור על שכבה שלמה"] },
      ],
    },
  },
  {
    id: "government",
    label: "אחר (שכר עובדי מדינה, דיגיטציה, רגולציה ותפעול משרדי ממשלה)",
    emoji: "🏛️",
    color: "#64748b",
    current: 10,
    min: 5,
    max: 20,
    insights: {
      decrease: [
        { threshold: -2,  severity: "warning",  text: "3,000 פחות פקידים. ומי יאשר לך את הבנייה? אחד." },
        { threshold: -4,  severity: "warning",  text: "ממשלה רזה. הרישוי לגן שלך? 3 שנים. במקרה הטוב." },
        { threshold: -6,  severity: "critical", text: "הממשל כמעט לא קיים. אנרכיה? לא. פשוט עוד בירוקרטיה, רק ללא תקציב." },
      ],
      increase: [
        { threshold: 3,   severity: "normal",   text: "3,000 עובדי מדינה נוספים. שורות קצרות יותר? אולי." },
        { threshold: 6,   severity: "normal",   text: "דיגיטציה מלאה של שירותי הממשלה. בעשר שנה מישהו ישתמש." },
      ],
    },
    highlights: {
      increase: [
        { threshold: 3, items: ["שורות קצרות יותר", "אישורים מהירים יותר", "שירות ציבורי שעובד"] },
        { threshold: 6, items: ["דיגיטציה מלאה של הממשל", "שירות ממשלתי 24/7", "מודל אסטוניה"] },
      ],
      decrease: [
        { threshold: -2, items: ["3,000 פחות פקידים", "אישור בנייה — שנתיים", "בירוקרטיה ללא תקציב"] },
        { threshold: -4, items: ["ממשלה שלא פועלת", "רישיון עסק — שנה וחצי", "עצמאים? לא שווה"] },
        { threshold: -6, items: ["ממשל מינימלי בפועל", "שירותים ציבוריים בקריסה", "כאוס מאורגן"] },
      ],
    },
  },
];

export const FIXED_ITEMS = [
  { label: "ריבית על חוב", amount: 64.6, note: "לא ניתן לשינוי — חוב קיים" },
  { label: "פנסיות ממשלתיות", amount: 26.8, note: "התחייבות חוקית" },
];

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

// Spending in categories not shown in the game (דיור, חקלאות, אנרגיה, משפטים, תרבות ועוד)
// Calibrated so that default category values produce exactly 4.9% deficit
// with revenue=613B and GDP=2420B:  (454+91.4+186.2−613)/2420 × 100 = 4.90%
const OTHER_SPENDING = 186.2;

export function calcDeficit(values) {
  const totalSpend =
    Object.values(values).reduce((a, b) => a + b, 0) +
    FIXED_ITEMS.reduce((a, b) => a + b.amount, 0) +
    OTHER_SPENDING;
  const revenue = 613; // הכנסות המדינה הצפויות לשנת 2027
  return ((totalSpend - revenue) / GDP * 100).toFixed(1);
}
