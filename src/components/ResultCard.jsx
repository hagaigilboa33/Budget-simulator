import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { CATEGORIES, calcDeficit, getHighlights } from "../data/budgetData";

const GOV_DEFICIT = 4.9;

/* ─────────────────────────────────────
   MAIN
───────────────────────────────────── */
export default function ResultCard({ values, name, onRestart }) {
  const cardRef  = useRef(null);
  const [saving, setSaving] = useState(false);

  const deficit = parseFloat(calcDeficit(values));
  const isGood  = deficit < GOV_DEFICIT;
  const defColor = deficit < 3.5 ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";

  // Build ranked highlights: top changes by absolute delta, with highlights data
  const withDelta = CATEGORIES.map(c => ({
    ...c,
    delta: Math.round(values[c.id] - c.current),
  }));

  const topChanges = withDelta
    .filter(c => Math.abs(c.delta) >= 2)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 4)
    .map(c => ({ ...c, highlights: getHighlights(c, c.delta) }))
    .filter(c => c.highlights);

  /* Share as image */
  const handleSave = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0A0F1E",
        scale: 2,
        useCORS: true,
        logging: false,
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

  /* WhatsApp */
  const handleWhatsApp = () => {
    const topTwo = topChanges.slice(0, 2);
    const lines = [
      `🇮🇱 בניתי את תקציב המדינה שלי עם כלכליסט`,
      ``,
      `הגירעון שלי: ${deficit}% | ממשלה: ${GOV_DEFICIT}%`,
      ...topTwo.map(c =>
        `${c.delta > 0 ? "📈" : "📉"} ${c.label}: ${c.delta > 0 ? "+" : ""}${c.delta} מיליארד ₪`
      ),
      ``,
      `בנה גם אתה 👇`,
      `calcalist.co.il/budget`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`, "_blank");
  };

  return (
    <div style={css.page}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      <motion.div
        style={css.shell}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Page header */}
        <div style={css.pageHeader}>
          <div style={css.navBrand}>
            <span style={css.navLogo}>כלכליסט</span>
            <span style={css.navDot} />
            <span style={css.navSub}>בחירות 2026</span>
          </div>
          <span style={css.pageTitle}>הכרטיס שלך מוכן</span>
        </div>

        {/* ── THE SHAREABLE CARD ── */}
        <div ref={cardRef} style={css.card}>

          {/* Card hero: name + deficit */}
          <div style={css.hero}>
            <div style={css.heroLeft}>
              <div style={css.heroSite}>📊 calcalist.co.il/budget · בחירות 2026</div>
              <div style={css.heroTitle}>שר האוצר {name}</div>
              <div style={{
                ...css.heroVerdict,
                color: isGood ? "#34D399" : "#F87171",
              }}>
                {isGood
                  ? `גירעון ${deficit}% — נמוך מהממשלה ✓`
                  : `גירעון ${deficit}% — גבוה מהממשלה`}
              </div>
            </div>
            <div style={{ ...css.defBadge, color: defColor, background: defColor + "18", border: `1.5px solid ${defColor}40` }}>
              <div style={css.defNum}>{deficit}%</div>
              <div style={css.defLabel}>גירעון</div>
            </div>
          </div>

          {/* Section divider */}
          <div style={css.sectionLabel}>המדיניות שלי</div>

          {/* Highlight blocks */}
          {topChanges.length === 0 ? (
            <div style={css.noChanges}>
              שמרת על תקציב הזהה לממשלה הנוכחית
            </div>
          ) : (
            <div style={css.grid}>
              {topChanges.map((cat, i) => (
                <div
                  key={cat.id}
                  style={{
                    ...css.block,
                    borderColor: cat.color + "35",
                    background: cat.color + "0C",
                  }}
                >
                  {/* Block header */}
                  <div style={css.blockTop}>
                    <div style={css.blockLeft}>
                      <span style={{ fontSize: 16, lineHeight: 1 }}>{cat.emoji}</span>
                      <span style={css.blockName}>{cat.label}</span>
                    </div>
                    <div style={{
                      ...css.blockDelta,
                      color: cat.delta > 0 ? "#34D399" : "#F87171",
                      background: (cat.delta > 0 ? "#34D399" : "#F87171") + "18",
                    }}>
                      <span dir="ltr">{cat.delta > 0 ? "+" : ""}{cat.delta} מיליארד</span>
                    </div>
                  </div>
                  {/* Bullet items */}
                  <div style={css.bullets}>
                    {cat.highlights.items.map((item, j) => (
                      <div key={j} style={css.bullet}>
                        <span style={{ color: cat.color, fontSize: 7, marginTop: 3, flexShrink: 0 }}>◆</span>
                        <span style={css.bulletText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Card footer */}
          <div style={css.cardFooter}>
            <span style={css.footerLeft}>בנה את התקציב שלך ←</span>
            <span style={css.footerRight}>calcalist.co.il/budget</span>
          </div>
        </div>

        {/* ── DEFICIT vs BoI TARGET ── */}
        <DeficitOverrunBanner deficit={deficit} />

        {/* ── SHARE ACTIONS ── */}
        <div style={css.actions}>
          <motion.button
            style={{ ...css.btn, ...css.btnWa }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(37,211,102,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
          >
            <span>💬</span> שתף ב-WhatsApp
          </motion.button>
          <motion.button
            style={{ ...css.btn, ...css.btnSave }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
          >
            <span>{saving ? "⏳" : "💾"}</span>
            {saving ? "יוצר תמונה..." : "שמור כתמונה"}
          </motion.button>
          <motion.button
            style={{ ...css.btn, ...css.btnRestart }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
          >
            ↩ נסה שוב
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
}

function DeficitOverrunBanner({ deficit }) {
  const target  = 3.5;
  const isOver  = deficit > target;
  const diff    = Math.abs(deficit - target).toFixed(1);
  const color   = deficit <= target ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";
  const bgColor = deficit <= target
    ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))"
    : "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(185,28,28,0.10))";
  const borderColor = deficit <= target ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.55)";

  return (
    <motion.div
      style={{ ...css.overrunBanner, background: bgColor, border: `2px solid ${borderColor}`,
        boxShadow: `0 0 32px ${color}22, inset 0 1px 0 rgba(255,255,255,0.04)` }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.3 }}
    >
      {/* Big deficit number */}
      <div style={{ ...css.overrunBigNum, color }}>{deficit}%</div>

      <div style={css.overrunBody}>
        <div style={{ ...css.overrunTitle, color }}>
          {isOver ? "חרגת מיעד הגירעון של בנק ישראל" : "עמדת ביעד הגירעון של בנק ישראל"}
        </div>
        <div style={css.overrunSub}>
          יעד בנק ישראל: <strong style={{ color: "rgba(255,255,255,0.7)" }}>3.5%</strong>
          {" · "}
          {isOver
            ? <span>חריגה של <strong style={{ color }}>{diff}%</strong></span>
            : <span>מתחת ב-<strong style={{ color }}>{diff}%</strong> ✓</span>
          }
        </div>
        {isOver && (
          <div style={css.overrunPunch}>הילדים שלך ישלמו על זה.</div>
        )}
      </div>
    </motion.div>
  );
}

function CompChip({ label, val, color, muted }) {
  return (
    <div style={{
      ...css.chip,
      opacity: muted ? 0.45 : 1,
      background: color + "14",
      border: `1px solid ${color}35`,
    }}>
      <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const css = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    padding: "0 0 80px",
  },
  shell: {
    maxWidth: 620,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 10,
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 0 22px",
    borderBottom: "1px solid var(--border)",
    marginBottom: 28,
  },
  navBrand: { display: "flex", alignItems: "center", gap: 8 },
  navLogo:  { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" },
  navDot:   { width: 4, height: 4, borderRadius: "50%", background: "var(--text-3)" },
  navSub:   { fontSize: 12, color: "var(--text-3)", fontWeight: 500 },
  pageTitle: { fontSize: 13, fontWeight: 600, color: "var(--text-2)" },

  /* The card */
  card: {
    background: "linear-gradient(160deg, #0A0F1E 0%, #0D1422 60%, #0F1628 100%)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22,
    padding: "24px 22px 20px",
    marginBottom: 20,
  },

  /* Hero */
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 22,
  },
  heroLeft: { flex: 1, minWidth: 0 },
  heroSite: { fontSize: 10, color: "var(--text-3)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.02em" },
  heroTitle: {
    fontSize: "clamp(22px, 5vw, 28px)",
    fontWeight: 900,
    color: "var(--text-1)",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    marginBottom: 6,
  },
  heroVerdict: { fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" },

  defBadge: {
    padding: "12px 16px",
    borderRadius: 14,
    textAlign: "center",
    flexShrink: 0,
  },
  defNum:   { fontSize: 26, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" },
  defLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7, marginTop: 3 },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(99,102,241,0.7)",
    marginBottom: 12,
  },

  /* No changes */
  noChanges: {
    fontSize: 14,
    color: "var(--text-3)",
    textAlign: "center",
    padding: "20px 0",
    fontStyle: "italic",
  },

  /* Highlights grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 18,
  },

  block: {
    borderRadius: 12,
    border: "1px solid",
    padding: "12px 12px 10px",
  },
  blockTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    gap: 6,
  },
  blockLeft: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 },
  blockName: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  blockDelta: {
    fontSize: 11,
    fontWeight: 800,
    padding: "2px 7px",
    borderRadius: 6,
    flexShrink: 0,
    letterSpacing: "-0.01em",
  },

  bullets: { display: "flex", flexDirection: "column", gap: 5 },
  bullet: { display: "flex", alignItems: "flex-start", gap: 6 },
  bulletText: {
    fontSize: 11,
    color: "var(--text-2)",
    lineHeight: 1.35,
    fontWeight: 500,
  },

  /* Deficit comparison */
  comparison: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 18,
    padding: "14px 0 0",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  chip: { borderRadius: 12, padding: "10px 18px", textAlign: "center" },
  vsText: { fontSize: 12, color: "var(--text-3)", fontWeight: 600 },

  /* Card footer */
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 12,
    fontSize: 11,
  },
  footerLeft:  { color: "var(--indigo, #6366F1)", fontWeight: 700 },
  footerRight: { color: "var(--text-3)" },

  /* Deficit overrun banner */
  overrunBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    background: "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(185,28,28,0.12))",
    border: "2px solid rgba(239,68,68,0.6)",
    borderRadius: 18,
    padding: "20px 22px",
    marginBottom: 16,
    boxShadow: "0 0 32px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  overrunBigNum: {
    fontSize: "clamp(32px, 7vw, 42px)",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    flexShrink: 0,
    alignSelf: "center",
    marginLeft: 4,
  },
  overrunBody: { flex: 1, minWidth: 0 },
  overrunTitle: {
    fontSize: 17,
    fontWeight: 900,
    color: "#FCA5A5",
    letterSpacing: "-0.02em",
    lineHeight: 1.3,
    marginBottom: 6,
  },
  overrunSub: {
    fontSize: 13,
    color: "rgba(252,165,165,0.75)",
    fontWeight: 500,
    marginBottom: 8,
  },
  overrunPunch: {
    fontSize: 15,
    fontWeight: 800,
    color: "#EF4444",
    letterSpacing: "-0.01em",
  },

  /* Action buttons */
  actions: { display: "flex", flexDirection: "column", gap: 10 },
  btn: {
    width: "100%", padding: "15px", borderRadius: 14,
    fontSize: 15, fontWeight: 700, border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, cursor: "pointer", transition: "all 0.2s",
    letterSpacing: "-0.01em",
  },
  btnWa: {
    background: "linear-gradient(135deg, #22C55E, #16A34A)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(34,197,94,0.25)",
  },
  btnSave: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
  },
  btnRestart: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text-2)",
  },
};
