import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { CATEGORIES, calcDeficit } from "../data/budgetData";

const GOV_DEFICIT = 4.9;
const BOI_TARGET  = 3.5;
const GDP         = 2420; // תמ"ג 2027

const SHORT = {
  defense:        "ביטחון",
  education:      "חינוך",
  health:         "בריאות",
  welfare:        "ביטוח לאומי",
  infrastructure: "תחבורה",
  social:         "רווחה",
  government:     "ממשל",
};

/* ═══════════════════════════════════
   SMART ANALYSIS — 3 always-present insights
═══════════════════════════════════ */
function buildAnalysis(withDelta, deficit) {
  const cat = id => withDelta.find(c => c.id === id);

  const defVal     = cat("defense").value;
  const defPct     = (defVal / GDP * 100).toFixed(1);
  const hlthVal    = cat("health").value;
  const eduVal     = cat("education").value;
  const hlthEduPct = ((hlthVal + eduVal) / GDP * 100).toFixed(1);
  const totalDelta = withDelta.reduce((a, c) => a + c.delta, 0);

  const defCtx = defVal > 170
    ? `גבוה מהיסטורי — ישראל תהיה בין 3 המדינות המוציאות ביותר`
    : defVal < 110
    ? `נמוך מהנוכחי — הרתעה אזורית נחלשת`
    : `ישראל לפניך: 5.9% · ממוצע OECD: 1.8%`;

  const hlthCtx = hlthVal + eduVal > 205
    ? `השקעה גבוהה — מתקרב לממוצע OECD (10.5%)`
    : hlthVal + eduVal < 160
    ? `נמוך — ישראל מאחרת עוד יותר מה-OECD`
    : `ישראל לפניך: 7.4% · ממוצע OECD: 10.5%`;

  const deficitCtx = deficit < BOI_TARGET
    ? `✓ מתחת ליעד בנק ישראל — ממשלת שמרנות פיסקלית`
    : deficit < GOV_DEFICIT
    ? `מתחת לממשלה הנוכחית, אבל מעל יעד BOI (3.5%)`
    : deficit < 7
    ? `מעל הממשלה הנוכחית — הדור הבא ישלם את ההפרש`
    : `גבוה מהיסטורי — שוקי האג"ח ישימו לב`;

  return [
    {
      emoji: "🛡️",
      label: "ביטחון ולאומי",
      value: `${defPct}% מהתמ"ג`,
      context: defCtx,
    },
    {
      emoji: "📚",
      label: "בריאות + חינוך",
      value: `${hlthEduPct}% מהתמ"ג`,
      context: hlthCtx,
    },
    {
      emoji: "📊",
      label: "גירעון",
      value: `${deficit}%`,
      context: deficitCtx,
    },
  ];
}

/* ═══════════════════════════════════
   MAIN
═══════════════════════════════════ */
export default function ResultCard({ values, name, onRestart }) {
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

  const analysis = buildAnalysis(withDelta, deficit);

  const vsGov = (deficit - GOV_DEFICIT).toFixed(1);
  const vsBOI = (deficit - BOI_TARGET).toFixed(1);
  const govColor = deficit < GOV_DEFICIT ? "#34D399" : "#F87171";
  const boiColor = deficit < BOI_TARGET  ? "#34D399" : deficit < 5 ? "#F59E0B" : "#F87171";

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

  /* WhatsApp */
  const handleWhatsApp = () => {
    const top = withDelta
      .filter(c => Math.abs(c.delta) >= 3)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 2);
    const lines = [
      `🇮🇱 בניתי את תקציב המדינה שלי עם כלכליסט`,
      ``,
      `הגירעון שלי: ${deficit}% | ממשלה: ${GOV_DEFICIT}%`,
      ...top.map(c => `${c.delta > 0 ? "📈" : "📉"} ${c.shortLabel}: ${c.delta > 0 ? "+" : ""}${c.delta} מיליארד ₪`),
      ``,
      `בנה גם אתה 👇`,
      `calcalist.co.il/budget`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`, "_blank");
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

            {/* name + deficit badge */}
            <div style={S.heroRow}>
              <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
                <div style={S.heroSup}>שר האוצר</div>
                <div style={S.heroName}>{name}</div>
              </div>
              <div style={{
                ...S.defBadge,
                borderColor: defColor + "55",
                background:  defColor + "14",
              }}>
                <div style={{ ...S.defNum, color: defColor }}>{deficit}%</div>
                <div style={S.defLabel}>גירעון</div>
              </div>
            </div>

            {/* deficit targets — replaces persona tag */}
            <div style={S.defTargetRow}>
              <div style={S.defTargetBlock}>
                <span style={{ ...S.defTargetLabel }}>יעד בנק ישראל</span>
                <span style={{ ...S.defTargetNum, color: boiColor }}>
                  {parseFloat(vsBOI) > 0 ? `▲ ${vsBOI}%` : `▼ ${Math.abs(parseFloat(vsBOI)).toFixed(1)}%`}
                </span>
                <span style={S.defTargetBase}>יעד: 3.5%</span>
              </div>
              <div style={S.defTargetDivider} />
              <div style={S.defTargetBlock}>
                <span style={S.defTargetLabel}>ממשלה נוכחית</span>
                <span style={{ ...S.defTargetNum, color: govColor }}>
                  {parseFloat(vsGov) > 0 ? `▲ ${vsGov}%` : `▼ ${Math.abs(parseFloat(vsGov)).toFixed(1)}%`}
                </span>
                <span style={S.defTargetBase}>ממשלה: 4.9%</span>
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
            {analysis.map((ins, i) => (
              <motion.div
                key={i}
                style={S.insightRow}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              >
                <div style={S.insightTop}>
                  <span style={S.insightEmoji}>{ins.emoji}</span>
                  <span style={S.insightLabel}>{ins.label}</span>
                  <span style={S.insightValue}>{ins.value}</span>
                </div>
                <div style={S.insightContext}>{ins.context}</div>
              </motion.div>
            ))}
          </div>

          {/* ── CARD FOOTER ── */}
          <div style={S.cardFooter}>
            <span style={S.footerCta}>בנה את התקציב שלך ←</span>
            <span style={S.footerUrl}>calcalist.co.il/budget</span>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={S.actions}>
          <motion.button
            style={{ ...S.btn, ...S.btnWa }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(37,211,102,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
          >
            <span>💬</span> שתף ב-WhatsApp
          </motion.button>
          <motion.button
            style={{ ...S.btn, ...S.btnSave }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
          >
            <span>{saving ? "⏳" : "📸"}</span>
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

  /* deficit targets row (replaces persona) */
  defTargetRow: {
    display: "flex", alignItems: "stretch", gap: 0,
    background: "rgba(255,255,255,0.03)", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.07)",
    overflow: "hidden", position: "relative", zIndex: 1,
  },
  defTargetBlock: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "10px 12px", gap: 2,
  },
  defTargetDivider: {
    width: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0",
  },
  defTargetLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
  },
  defTargetNum: {
    fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.2,
  },
  defTargetBase: {
    fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 500,
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
  analysis: { padding: "14px 22px 10px" },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.75)", marginBottom: 12,
  },
  insightRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  insightTop: {
    display: "flex", alignItems: "center", gap: 7, marginBottom: 4,
  },
  insightEmoji: { fontSize: 14, lineHeight: 1, flexShrink: 0 },
  insightLabel: {
    fontSize: 12, fontWeight: 700, color: "#CBD5E1",
    flex: 1,
  },
  insightValue: {
    fontSize: 12, fontWeight: 800, color: "#F1F5F9",
    direction: "ltr", display: "inline-block",
  },
  insightContext: {
    fontSize: 11, color: "rgba(255,255,255,0.38)",
    fontWeight: 500, lineHeight: 1.5,
    paddingRight: 21, // indent under emoji
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
  btn: {
    width: "100%", padding: "15px", borderRadius: 14,
    fontSize: 15, fontWeight: 700, border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, cursor: "pointer", transition: "all 0.2s", letterSpacing: "-0.01em",
  },
  btnWa: {
    background: "linear-gradient(135deg, #22C55E, #16A34A)",
    color: "#fff", boxShadow: "0 4px 20px rgba(34,197,94,0.25)",
  },
  btnSave: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#fff", boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
  },
  btnRestart: {
    width: "100%", padding: "12px",
    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 600,
    borderRadius: 12, cursor: "pointer", letterSpacing: "-0.01em",
  },
};
