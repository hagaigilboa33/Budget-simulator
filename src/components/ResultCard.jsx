import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { CATEGORIES, calcDeficit } from "../data/budgetData";

const GOV_DEFICIT = 3.4; // יעד הגירעון
const GDP         = 2420; // תמ"ג 2027

const SHORT = {
  defense:          "ביטחון",
  national_security:"ביטחון לאומי",
  education:        "חינוך",
  health:           "בריאות",
  welfare:          "רווחה",
  transit_housing:  "תחבורה ודיור",
  rehabilitation:   "תקומה",
  infrastructure:   "תשתיות",
  economy:          "חקלאות ותיירות",
  government:       "ממשל",
};

/* ═══════════════════════════════════
   SHARE SVG ICONS
═══════════════════════════════════ */
const SvgIcons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  save: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  ),
};

/* ═══════════════════════════════════
   ANALYSIS PARAGRAPH
═══════════════════════════════════ */
function buildAnalysis(withDelta, deficit, totalBudget, overUnder) {
  const GOV_BUDGET = 673; // מחויבויות הממשלה ל-2027: 570 סליידרים + 103 קבוע
  const budgetDiff = totalBudget - GOV_BUDGET;

  /* משפט 1: גודל התקציב */
  let s1;
  if (Math.abs(budgetDiff) < 5)
    s1 = `לא שינית את גודל התקציב לעומת מחויבויות הממשלה ל-2027`;
  else if (budgetDiff > 0)
    s1 = `הגדלת את התקציב ב-${budgetDiff} מיליארד לעומת מחויבויות הממשלה ל-2027, ל-${totalBudget} מיליארד שקל`;
  else
    s1 = `הקטנת את התקציב ב-${Math.abs(budgetDiff)} מיליארד לעומת מחויבויות הממשלה ל-2027, ל-${totalBudget} מיליארד שקל`;

  /* משפט 2: כמה חולק מהתקציב שנקבע */
  let s2;
  if (Math.abs(overUnder) < 1)
    s2 = `חילקת את התקציב במדויק`;
  else if (overUnder < 0)
    s2 = `נותרו ${Math.abs(overUnder)} מיליארד שקל שלא חולקו מהתקציב שקבעת`;
  else
    s2 = `חרגת ב-${overUnder} מיליארד שקל מעבר לתקציב שקבעת`;

  /* משפט 3: גירעון */
  const deficitLabel = deficit <= GOV_DEFICIT ? "נמוך"
    : deficit <= 5   ? "סביר"
    : deficit <= 7   ? "גבוה"
    : "קיצוני";
  const s3 = `בסך הכל, רשמת גירעון ${deficitLabel} של ${deficit}% ביחס ליעד הגירעון הקבוע בחוק ל-2027 (${GOV_DEFICIT}%)`;

  /* משפט 4: סדר עדיפויות */
  const allChanges = [...withDelta]
    .filter(c => Math.abs(c.delta) >= 3)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const increased = allChanges.filter(c => c.delta >= 3).slice(0, 2);
  const decreased = allChanges.filter(c => c.delta <= -3).slice(0, 2);

  let s4;
  if (increased.length === 0 && decreased.length === 0) {
    s4 = `שמרת על חלוקת התקציב קרובה למחויבויות הממשלה ל-2027.`;
  } else {
    const parts = [];
    if (increased.length > 0)
      parts.push(`יותר כסף ל${increased.map(c => c.shortLabel).join(" ול")}`);
    if (decreased.length > 0)
      parts.push(`פחות כסף ל${decreased.map(c => c.shortLabel).join(" ול")}`);
    s4 = `סדר העדיפויות שלך: ${parts.join(", ")}.`;
  }

  /* משפט 5: משמעות העדיפות הגדולה ביותר */
  const IMPLICATIONS = {
    defense: {
      up:   `הגדלה ניכרת בתקציב הביטחון מגדילה את הנטל הקבוע על תקציב המדינה ומצמצמת את הגמישות לסדרי עדיפויות אחרים בשנים הבאות.`,
      down: `הפחתה בתקציב הביטחון מפנה משאבים לתחומים אחרים, אך מחייבת שינויים מבניים עמוקים בצבא ובמערך הביטחוני.`,
    },
    health: {
      up:   `השקעה בבריאות מביאה לשיפור בתוחלת החיים ובפריון העבודה — ובעלת תשואה כלכלית גבוהה לאורך שנים.`,
      down: `קיצוץ בתקציב הבריאות מגדיל את תורי ההמתנה בשירות הציבורי ועלול להגדיל את הפנייה לרפואה פרטית.`,
    },
    education: {
      up:   `השקעה בחינוך היא ממנופי הצמיחה ארוכי הטווח — מחקרים מראים שכל שקל שמושקע בחינוך מחזיר פי כמה לכלכלה.`,
      down: `קיצוץ בחינוך עלול לפגוע בהשכלה ובכושר ההשתכרות של הדור הבא ולהרחיב פערים חברתיים.`,
    },
    welfare: {
      up:   `הרחבת רשת הביטחון הסוציאלי מפחיתה אי-שוויון ומסייעת לאוכלוסיות חלשות, אך מחייבת מקורות מימון מתמשכים.`,
      down: `קיצוץ בתקציבי הרווחה עלול להרחיב פערים חברתיים ולגדיל את שיעורי העוני, בייחוד בקרב אוכלוסיות חלשות.`,
    },
    transit_housing: {
      up:   `השקעה בתחבורה ציבורית ודיור מסייעת להוזלת יוקר המחיה ולשיפור הנגישות לשוק העבודה.`,
      down: `קיצוץ בתחבורה ודיור עלול להאט את הבנייה ולהחמיר את משבר הדיור לאורך שנים.`,
    },
    rehabilitation: {
      up:   `השקעה בשיקום ופיתוח הפריפריה מסייעת לצמצום הפערים הגיאוגרפיים בין מרכז לפריפריה.`,
      down: `קיצוץ בתוכניות שיקום עלול להאט את פיתוח הפריפריה ולהעמיק את הפערים הגיאוגרפיים.`,
    },
    infrastructure: {
      up:   `השקעה בתשתיות היא ממנועי הצמיחה הכלכלית ארוכי הטווח ומגדילה את פריון המשק.`,
      down: `קיצוץ בתשתיות מגדיל את הפערים ביחס למדינות מפותחות ועלול לפגוע בפריון הכלכלי לאורך שנים.`,
    },
    national_security: {
      up:   `הגדלת תקציב הביטחון הפנימי מחזקת את כוחות האכיפה ואת תחושת הביטחון האישי של האזרחים.`,
      down: `קיצוץ בביטחון הפנימי עלול לפגוע ביכולות האכיפה ובמוכנות לחירום פנימי.`,
    },
    economy: {
      up:   `תמיכה בחקלאות ותיירות מסייעת לחיזוק הפריפריה ולגיוון מקורות ההכנסה של המשק.`,
      down: `קיצוץ בתמיכה לחקלאות ותיירות עלול לפגוע בביטחון המזון ובפיתוח ענפי המשק בפריפריה.`,
    },
    government: {
      up:   `הגדלת תקציב הממשל עשויה לשפר שירותים ממשלתיים, אך עלולה להגדיל את היקף הבירוקרטיה הציבורית.`,
      down: `קיצוץ בהוצאות הממשל מצמצם את גודל המגזר הציבורי, אך עלול לפגוע באיכות השירותים לאזרח.`,
    },
  };

  const topChange = allChanges[0];
  let s5 = "";
  if (topChange) {
    const dir = topChange.delta > 0 ? "up" : "down";
    s5 = ` ${IMPLICATIONS[topChange.id]?.[dir] ?? ""}`;
  }

  return `${s1}. ${s2}. ${s3}. ${s4}${s5}`;
}

/* ═══════════════════════════════════
   MAIN
═══════════════════════════════════ */
export default function ResultCard({ values, name, totalBudget, onRestart }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const deficit  = parseFloat(calcDeficit(values));
  const defColor = deficit < 3.5 ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";

  const withDelta = CATEGORIES.map(c => ({
    ...c,
    value:      values[c.id],
    delta:      Math.round(values[c.id] - c.current),
    shortLabel: SHORT[c.id] || c.label.split(" ")[0],
  }));

  const vsTarget    = (deficit - GOV_DEFICIT).toFixed(1);
  const targetColor = deficit < GOV_DEFICIT ? "#34D399" : "#F87171";

  const totalAllocated  = Object.values(values).reduce((a, b) => a + b, 0);
  const pool            = (totalBudget ?? 613) - 103;
  const overUnder       = totalAllocated - pool; // חיובי = חריגה, שלילי = נותר
  const effectiveBudget = Math.round((totalBudget ?? 613) + overUnder);

  const analysisParagraph = buildAnalysis(withDelta, deficit, totalBudget, overUnder);

  /* save as image */
  const handleSave = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#070B14",
        scale: 2, useCORS: true, logging: false,
      });
      const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
      const file = new File([blob], `תקציב-${name}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `התקציב של ${name}`, files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), { href: url, download: file.name }).click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  /* share text helper */
  const buildShareText = () => {
    const top = withDelta
      .filter(c => Math.abs(c.delta) >= 3)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 2);
    return [
      `🇮🇱 בניתי את תקציב המדינה שלי עם כלכליסט`,
      ``,
      `גירעון: ${deficit}% | יעד: ${GOV_DEFICIT}%`,
      ...top.map(c => `${c.delta > 0 ? "📈" : "📉"} ${c.shortLabel}: ${c.delta > 0 ? "+" : ""}${c.delta} מיליארד ₪`),
      ``,
      `בנה גם אתה 👇`,
      `calcalist.co.il/budget`,
    ].filter(Boolean).join("\n");
  };

  const handleWhatsApp  = () => window.open(`https://wa.me/?text=${encodeURIComponent(buildShareText())}`, "_blank");
  const handleTelegram  = () => window.open(`https://t.me/share/url?url=${encodeURIComponent("https://calcalist.co.il/budget")}&text=${encodeURIComponent(buildShareText())}`, "_blank");
  const handleFacebook  = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://calcalist.co.il/budget")}`, "_blank");
  const handleEmail     = () => {
    const subject = `התקציב של ${name} — כלכליסט בחירות 2026`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildShareText())}`);
  };
  const handleInstagram = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#070B14", scale: 2, useCORS: true, logging: false });
      const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
      const file = new File([blob], `תקציב-${name}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `התקציב של ${name}`, files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), { href: url, download: file.name }).click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div style={S.page}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      <motion.div
        style={S.shell}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* nav */}
        <div style={S.pageHeader}>
          <div style={S.navBrand}>
            <span style={S.navLogo}>כלכליסט</span>
            <span style={S.navDot} />
            <span style={S.navSub}>בחירות 2026</span>
          </div>
          <span style={S.pageTitle}>הכרטיס שלך מוכן</span>
        </div>

        {/* CARD */}
        <div
          ref={cardRef}
          style={{
            ...S.card,
            boxShadow: `0 0 0 1.5px ${defColor}28, 0 40px 100px rgba(0,0,0,0.7)`,
          }}
        >
          {/* ── HERO ── */}
          <div style={S.hero}>
            {/* atmospheric glow */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse 90% 70% at 50% -5%, ${defColor}28 0%, transparent 65%)`,
            }} />

            <div style={S.heroMeta}>📊 calcalist.co.il/budget · בחירות 2026</div>

            {/* name */}
            <div style={{ position: "relative", zIndex: 1, marginBottom: 18 }}>
              <div style={S.heroSup}>שר האוצר</div>
              <div style={S.heroName}>{name}</div>
            </div>

            {/* Two big numbers, each with its own sub-chip */}
            <div style={S.bigStatsRow}>
              <div style={S.bigStatBlock}>
                <div style={S.bigStatLabel}>גודל התקציב</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, direction: "rtl" }}>
                  <span style={S.bigStatNum}>{effectiveBudget}</span>
                  <span style={S.bigStatUnit}>מיליארד ₪</span>
                </div>
                <span style={S.benchChip}>
                  {Math.abs(overUnder) < 1
                    ? <span style={{ color: "#34D399", fontWeight: 700 }}>חולק במדויק ✓</span>
                    : overUnder > 0
                    ? <span style={{ color: "#F87171", fontWeight: 700 }}>חריגה: +{Math.round(overUnder)} מיליארד</span>
                    : <span style={{ color: "#34D399", fontWeight: 700 }}>נותרו: {Math.abs(Math.round(overUnder))} מיליארד</span>
                  }
                </span>
              </div>
              <div style={S.bigStatDivider} />
              <div style={S.bigStatBlock}>
                <div style={S.bigStatLabel}>הגירעון שלי</div>
                <div style={{ ...S.bigStatNum, color: defColor }}>{deficit}%</div>
                <span style={S.benchChip}>
                  יעד גירעון 2027:{" "}
                  <span style={{ color: targetColor, fontWeight: 700 }}>{GOV_DEFICIT}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── BUDGET DNA BAR ── */}
          <BudgetDnaBar withDelta={withDelta} />

          {/* ── ALLOCATION ROWS ── */}
          <div style={S.alloc}>
            <div style={S.allocHead}>
              <span style={S.allocTitle}>חלוקת התקציב שלי</span>
              <span style={S.allocLegend}>
                <span style={{ color: "rgba(255,255,255,0.28)" }}>▎</span> ממשלה · מיליארד ₪
              </span>
            </div>
            {withDelta.map(cat => {
              const pct    = (cat.value  / cat.max) * 100;
              const govPct = (cat.current / cat.max) * 100;
              const isUp   = cat.delta > 0;
              const nc     = Math.abs(cat.delta) < 1;
              const dc     = nc ? "#334155" : isUp ? "#34D399" : "#F87171";
              return (
                <div key={cat.id} style={S.aRow}>
                  <div style={S.aLabel}>
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{cat.emoji}</span>
                    <span style={S.aName}>{cat.shortLabel}</span>
                  </div>
                  <div style={S.aBarWrap}>
                    <div style={S.aTrack} />
                    <div style={{ ...S.aGovMark, left: `${govPct}%` }} />
                    <div style={{
                      ...S.aFill,
                      width:      `${pct}%`,
                      background: nc ? cat.color + "4D" : cat.color + "99",
                    }} />
                  </div>
                  <div style={S.aRight}>
                    <span style={{ ...S.aVal, direction: "ltr" }}>{cat.value}</span>
                    {!nc && (
                      <span style={{ ...S.aDelta, color: dc, direction: "ltr" }}>
                        {isUp ? "+" : ""}{cat.delta}
                      </span>
                    )}
                    {nc && <span style={S.aDeltaNc}>—</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── SMART ANALYSIS ── */}
          <div style={S.analysis}>
            <div style={S.sectionLabel}>ניתוח</div>
            <motion.p
              style={S.analysisParagraph}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {analysisParagraph}
            </motion.p>
          </div>

          {/* ── CARD FOOTER ── */}
          <div style={S.cardFooter}>
            <span style={S.footerCta}>בנה את התקציב שלך ←</span>
            <span style={S.footerUrl}>calcalist.co.il/budget</span>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={S.actions}>
          <div style={S.shareTitle}>שתף את התקציב שלך</div>
          <div style={S.shareGrid}>
            {[
              { id: "whatsapp", label: "WhatsApp", bg: "#25D366",   shadow: "rgba(37,211,102,0.35)",  fn: handleWhatsApp  },
              { id: "telegram", label: "Telegram",  bg: "#2AABEE",   shadow: "rgba(42,171,238,0.35)",  fn: handleTelegram  },
              { id: "facebook", label: "Facebook",  bg: "#1877F2",   shadow: "rgba(24,119,242,0.35)",  fn: handleFacebook  },
              { id: "instagram",label: "Instagram", bg: "linear-gradient(135deg,#f58529,#dd2a7b,#515bd4)", shadow: "rgba(221,42,123,0.35)", fn: handleInstagram },
              { id: "email",    label: "מייל",      bg: "#475569",   shadow: "rgba(71,85,105,0.35)",   fn: handleEmail     },
            ].map(p => (
              <motion.button
                key={p.id}
                style={{ ...S.shareBtn, background: p.bg }}
                whileHover={{ scale: 1.06, y: -3, boxShadow: `0 10px 28px ${p.shadow}` }}
                whileTap={{ scale: 0.93 }}
                onClick={p.fn}
              >
                {SvgIcons[p.id]}
                <span style={S.shareBtnLabel}>{p.label}</span>
              </motion.button>
            ))}
          </div>
          <motion.button
            style={S.btnSave}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
          >
            {SvgIcons.save}
            {saving ? "יוצר תמונה..." : "שמור כתמונה"}
          </motion.button>
          <button style={S.btnRestart} onClick={onRestart}>↩ נסה שוב</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════
   BUDGET DNA BAR
═══════════════════════════════════ */
function BudgetDnaBar({ withDelta }) {
  return (
    <div style={S.dna}>
      <div style={S.dnaBar}>
        {withDelta.map(cat => (
          <div
            key={cat.id}
            title={`${cat.shortLabel}: ${cat.value}B`}
            style={{
              flex: cat.value,
              background: cat.color,
              opacity: Math.abs(cat.delta) >= 2 ? 0.85 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   STYLES
═══════════════════════════════════ */
const S = {
  page:  { minHeight: "100vh", position: "relative", overflow: "hidden", padding: "0 0 80px" },
  shell: { maxWidth: 620, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 10 },

  pageHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 0 22px", borderBottom: "1px solid var(--border)", marginBottom: 24,
  },
  navBrand:  { display: "flex", alignItems: "center", gap: 8 },
  navLogo:   { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" },
  navDot:    { width: 4, height: 4, borderRadius: "50%", background: "var(--text-3)" },
  navSub:    { fontSize: 12, color: "var(--text-3)", fontWeight: 500 },
  pageTitle: { fontSize: 13, fontWeight: 600, color: "var(--text-2)" },

  /* card */
  card: {
    background: "#070B14",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22, overflow: "hidden", marginBottom: 16,
  },

  /* HERO */
  hero: {
    position: "relative", overflow: "hidden",
    padding: "22px 22px 18px",
    background: "linear-gradient(180deg, #0D1525 0%, #080C18 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  heroMeta: {
    fontSize: 10, color: "rgba(255,255,255,0.22)", fontWeight: 500,
    letterSpacing: "0.03em", marginBottom: 18, position: "relative", zIndex: 1,
  },
  heroRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    gap: 14, marginBottom: 16,
  },
  heroSup: {
    fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.28)",
    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, position: "relative", zIndex: 1,
  },
  heroName: {
    fontSize: "clamp(26px, 6.5vw, 36px)", fontWeight: 900,
    color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05,
    position: "relative", zIndex: 1,
  },
  defBadge: {
    flexShrink: 0, padding: "12px 18px", borderRadius: 16,
    textAlign: "center", border: "1.5px solid", position: "relative", zIndex: 1,
  },
  defNum: {
    fontSize: "clamp(28px, 7vw, 38px)", fontWeight: 900,
    letterSpacing: "-0.04em", lineHeight: 1,
  },
  defLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 3,
  },

  /* big stats row */
  bigStatsRow: {
    display: "flex", alignItems: "center",
    marginBottom: 14, position: "relative", zIndex: 1,
  },
  bigStatBlock: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
  },
  bigStatDivider: {
    width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.1)", margin: "0 16px",
  },
  bigStatLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
  },
  bigStatNum: {
    fontSize: "clamp(28px, 7vw, 38px)", fontWeight: 900,
    letterSpacing: "-0.04em", lineHeight: 1,
    color: "rgba(255,255,255,0.92)",
  },
  bigStatUnit: {
    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)",
  },

  /* benchmark chips */
  benchRow: {
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    position: "relative", zIndex: 1,
  },
  benchChip: {
    fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.38)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 100, padding: "4px 10px",
  },

  /* DNA BAR */
  dna: { padding: "10px 22px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  dnaBar: {
    display: "flex", height: 5, borderRadius: 3, overflow: "hidden", gap: 1,
  },

  /* ALLOCATION */
  alloc: { padding: "14px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  allocHead: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 11,
  },
  allocTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.75)",
  },
  allocLegend: { fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 500 },

  aRow:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 7 },
  aLabel: { display: "flex", alignItems: "center", gap: 5, width: 88, flexShrink: 0 },
  aName: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.42)", whiteSpace: "nowrap" },
  aBarWrap: { flex: 1, position: "relative", height: 7, borderRadius: 4, overflow: "hidden" },
  aTrack: { position: "absolute", inset: 0, background: "rgba(255,255,255,0.05)", borderRadius: 4 },
  aGovMark: {
    position: "absolute", top: 1, bottom: 1,
    width: 2, background: "rgba(255,255,255,0.22)",
    transform: "translateX(-50%)", borderRadius: 1, zIndex: 2,
  },
  aFill:   { position: "absolute", top: 0, left: 0, bottom: 0, borderRadius: 4 },
  aRight:  {
    width: 56, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
  },
  aVal:    { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)" },
  aDelta:  { fontSize: 9, fontWeight: 800 },
  aDeltaNc:{ fontSize: 9, color: "#1E293B", fontWeight: 600 },

  /* SMART ANALYSIS */
  analysis: { padding: "14px 22px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.75)", marginBottom: 10,
  },
  analysisParagraph: {
    margin: 0,
    fontSize: 12.5,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.55)",
    fontWeight: 500,
    textAlign: "right",
  },

  /* CARD FOOTER */
  cardFooter: {
    display: "flex", justifyContent: "space-between",
    padding: "11px 22px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: 10,
  },
  footerCta: { color: "#6366F1", fontWeight: 700 },
  footerUrl: { color: "rgba(255,255,255,0.16)" },

  /* ACTIONS */
  actions: { display: "flex", flexDirection: "column", gap: 10 },
  shareTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
    textAlign: "center",
  },
  shareGrid: {
    display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8,
  },
  shareBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 6, padding: "14px 4px",
    borderRadius: 16, border: "none", cursor: "pointer",
    color: "#fff", transition: "all 0.2s",
  },
  shareBtnLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.01em",
    opacity: 0.9, whiteSpace: "nowrap",
  },
  btnSave: {
    width: "100%", padding: "14px", borderRadius: 14,
    fontSize: 14, fontWeight: 700,
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#fff", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
  },
  btnRestart: {
    width: "100%", padding: "12px",
    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 600,
    borderRadius: 12, cursor: "pointer", letterSpacing: "-0.01em",
  },
};
