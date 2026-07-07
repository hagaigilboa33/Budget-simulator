import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { CATEGORIES, calcDeficit, getHighlights } from "../data/budgetData";

const GOV_DEFICIT = 4.9;
const BOI_TARGET  = 3.5;

/* ─── PERSONA based on deficit ─── */
const PERSONAS = [
  { maxDef: 2,   emoji: "🏔️", label: "הצנע הגדול",      desc: "תקציב גרמני, מדינה ישראלית" },
  { maxDef: 3.5, emoji: "⚖️", label: "השמרן המאוזן",     desc: "בנק ישראל שר לכבודך" },
  { maxDef: 5,   emoji: "♻️", label: "ממשלת ההמשכיות",  desc: "שינוי? כמעט אותו דבר" },
  { maxDef: 6.5, emoji: "💸", label: "הנדיב המלאכותי",   desc: "מישהו ישלם, לא עכשיו" },
  { maxDef: 999, emoji: "🎭", label: "הפוליטיקאי",       desc: "הכלכלנים בוכים בשקט" },
];

/* ─── SHORT category labels ─── */
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
   MAIN
═══════════════════════════════════ */
export default function ResultCard({ values, name, onRestart }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const deficit  = parseFloat(calcDeficit(values));
  const isGood   = deficit < GOV_DEFICIT;
  const defColor = deficit < 3.5 ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";
  const persona  = PERSONAS.find(p => deficit < p.maxDef);

  const withDelta = CATEGORIES.map(c => ({
    ...c,
    value:      values[c.id],
    delta:      Math.round(values[c.id] - c.current),
    shortLabel: SHORT[c.id] || c.label.split(" ")[0],
  }));

  const topChanges = withDelta
    .filter(c => Math.abs(c.delta) >= 2)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 4)
    .map(c => ({ ...c, highlights: getHighlights(c, c.delta) }))
    .filter(c => c.highlights);

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
    const top = topChanges.slice(0, 2);
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

        {/* ══ CARD (screenshot target) ══ */}
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

            {/* meta line */}
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

            {/* persona + verdict chips */}
            <div style={S.heroBadgeRow}>
              <span style={{
                ...S.chip,
                color:       defColor,
                borderColor: defColor + "45",
                background:  defColor + "10",
              }}>
                {persona.emoji} {persona.label} · {persona.desc}
              </span>
              <span style={{
                ...S.chip,
                color:       isGood ? "#34D399" : "#F87171",
                borderColor: (isGood ? "#34D399" : "#F87171") + "45",
                background:  (isGood ? "#34D399" : "#F87171") + "10",
              }}>
                {isGood
                  ? `✓ מתחת לממשלה ב-${(GOV_DEFICIT - deficit).toFixed(1)}%`
                  : `▲ מעל הממשלה ב-${(deficit - GOV_DEFICIT).toFixed(1)}%`}
              </span>
            </div>
          </div>

          {/* ── BUDGET DNA BAR ── */}
          <BudgetDnaBar withDelta={withDelta} />

          {/* ── ALLOCATION ROWS ── */}
          <div style={S.alloc}>
            <div style={S.allocHead}>
              <span style={S.allocTitle}>חלוקת התקציב שלי</span>
              <span style={S.allocLegend}>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>▎</span> ממשלה · מיליארד ₪
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
                    {/* government baseline */}
                    <div style={{ ...S.aGovMark, left: `${govPct}%` }} />
                    {/* user fill */}
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

          {/* ── HIGHLIGHTS ── */}
          {topChanges.length > 0 && (
            <div style={S.hlSection}>
              <div style={S.sectionLabel}>המדיניות המרכזית שלי</div>
              <div style={S.hlGrid}>
                {topChanges.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    style={{
                      ...S.hlBlock,
                      borderColor:  cat.color + "28",
                      background:   cat.color + "0C",
                      borderRight:  `3px solid ${cat.color}99`,
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
                  >
                    <div style={S.hlTop}>
                      <div style={S.hlTopLeft}>
                        <span style={{ fontSize: 14, lineHeight: 1 }}>{cat.emoji}</span>
                        <span style={S.hlName}>{cat.shortLabel}</span>
                      </div>
                      <div style={{
                        ...S.hlDelta,
                        color:      cat.delta > 0 ? "#34D399" : "#F87171",
                        background: (cat.delta > 0 ? "#34D399" : "#F87171") + "18",
                      }}>
                        <span style={{ direction: "ltr", display: "inline-flex", gap: 2, alignItems: "baseline" }}>
                          <span>{cat.delta > 0 ? "+" : ""}{cat.delta}</span>
                          <span style={{ fontSize: "0.8em", opacity: 0.8 }}>B</span>
                        </span>
                      </div>
                    </div>
                    <div style={S.hlBullets}>
                      {cat.highlights.items.map((item, j) => (
                        <div key={j} style={S.hlBullet}>
                          <span style={{ color: cat.color, fontSize: 6, marginTop: 3, flexShrink: 0 }}>◆</span>
                          <span style={S.hlBulletText}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── CARD FOOTER ── */}
          <div style={S.cardFooter}>
            <span style={S.footerCta}>בנה את התקציב שלך ←</span>
            <span style={S.footerUrl}>calcalist.co.il/budget</span>
          </div>
        </div>

        {/* ══ DEFICIT BANNER ══ */}
        <DeficitBanner deficit={deficit} defColor={defColor} />

        {/* ══ SHARE ACTIONS ══ */}
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
          <motion.button
            style={{ ...S.btn, ...S.btnRestart }}
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

/* ═══════════════════════════════════
   BUDGET DNA BAR
   Stacked segments showing category proportions
═══════════════════════════════════ */
function BudgetDnaBar({ withDelta }) {
  const total = withDelta.reduce((a, c) => a + c.value, 0);
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
              opacity: Math.abs(cat.delta) >= 2 ? 0.85 : 0.38,
            }}
          />
        ))}
      </div>
      <div style={S.dnaLegend}>
        {withDelta.filter(c => Math.abs(c.delta) >= 2).map(cat => (
          <span key={cat.id} style={{ ...S.dnaChip, color: cat.color }}>
            {cat.emoji} {Math.round(cat.value / total * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   DEFICIT BANNER
═══════════════════════════════════ */
function DeficitBanner({ deficit, defColor }) {
  const isOver = deficit > BOI_TARGET;
  const diff   = Math.abs(deficit - BOI_TARGET).toFixed(1);
  const bg     = !isOver
    ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))"
    : "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(185,28,28,0.10))";

  return (
    <motion.div
      style={{ ...S.banner, background: bg, borderColor: defColor + "55" }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.3 }}
    >
      <div style={{ ...S.bannerNum, color: defColor }}>{deficit}%</div>
      <div style={S.bannerBody}>
        <div style={{ ...S.bannerTitle, color: defColor }}>
          {isOver ? "חרגת מיעד הגירעון של בנק ישראל" : "עמדת ביעד הגירעון של בנק ישראל"}
        </div>
        <div style={{ ...S.bannerSub, color: isOver ? "rgba(252,165,165,0.7)" : "rgba(52,211,153,0.7)" }}>
          יעד: <strong style={{ color: "rgba(255,255,255,0.75)" }}>3.5%</strong>
          {" · "}
          {isOver
            ? <span>חריגה של <strong style={{ color: defColor }}>{diff}%</strong></span>
            : <span>מתחת ב-<strong style={{ color: defColor }}>{diff}%</strong> ✓</span>}
        </div>
        {isOver && <div style={S.bannerPunch}>הילדים שלך ישלמו על זה.</div>}
        {!isOver && <div style={{ ...S.bannerPunch, color: "#10B981" }}>בנק ישראל מאושר ממך. לא כמו מהממשלה.</div>}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   STYLES
═══════════════════════════════════ */
const S = {
  /* layout */
  page:  { minHeight: "100vh", position: "relative", overflow: "hidden", padding: "0 0 80px" },
  shell: { maxWidth: 620, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 10 },

  /* nav */
  pageHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 0 22px", borderBottom: "1px solid var(--border)", marginBottom: 24,
  },
  navBrand: { display: "flex", alignItems: "center", gap: 8 },
  navLogo:  { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" },
  navDot:   { width: 4, height: 4, borderRadius: "50%", background: "var(--text-3)" },
  navSub:   { fontSize: 12, color: "var(--text-3)", fontWeight: 500 },
  pageTitle:{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" },

  /* card shell */
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
    gap: 14, marginBottom: 14,
  },
  heroSup: {
    fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.28)",
    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4,
  },
  heroName: {
    fontSize: "clamp(26px, 6.5vw, 36px)", fontWeight: 900,
    color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05,
    position: "relative", zIndex: 1,
  },
  defBadge: {
    flexShrink: 0, padding: "12px 18px", borderRadius: 16,
    textAlign: "center", border: "1.5px solid",
    position: "relative", zIndex: 1,
  },
  defNum: {
    fontSize: "clamp(28px, 7vw, 38px)", fontWeight: 900,
    letterSpacing: "-0.04em", lineHeight: 1,
  },
  defLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 3,
  },
  heroBadgeRow: {
    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
    position: "relative", zIndex: 1,
  },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "5px 11px", borderRadius: 100,
    fontSize: 11, fontWeight: 600, border: "1px solid",
    letterSpacing: "-0.01em",
  },

  /* DNA BAR */
  dna: {
    padding: "0 22px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  dnaBar: {
    display: "flex", height: 6, borderRadius: 3, overflow: "hidden",
    gap: 1, marginBottom: 8,
  },
  dnaLegend: {
    display: "flex", gap: 10, flexWrap: "wrap",
  },
  dnaChip: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.01em",
  },

  /* ALLOCATION */
  alloc: {
    padding: "14px 22px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  allocHead: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    marginBottom: 11,
  },
  allocTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.75)",
  },
  allocLegend: { fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 500 },

  aRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 7 },
  aLabel: {
    display: "flex", alignItems: "center", gap: 5,
    width: 88, flexShrink: 0,
  },
  aName: {
    fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.42)",
    whiteSpace: "nowrap",
  },
  aBarWrap: {
    flex: 1, position: "relative", height: 8, borderRadius: 4, overflow: "hidden",
  },
  aTrack: {
    position: "absolute", inset: 0,
    background: "rgba(255,255,255,0.05)", borderRadius: 4,
  },
  aGovMark: {
    position: "absolute", top: 1, bottom: 1,
    width: 2, background: "rgba(255,255,255,0.22)",
    transform: "translateX(-50%)", borderRadius: 1, zIndex: 2,
  },
  aFill: {
    position: "absolute", top: 0, left: 0, bottom: 0, borderRadius: 4,
  },
  aRight: {
    width: 56, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
  },
  aVal:    { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)" },
  aDelta:  { fontSize: 9, fontWeight: 800 },
  aDeltaNc:{ fontSize: 9, color: "#1E293B", fontWeight: 600 },

  /* HIGHLIGHTS */
  hlSection: { padding: "14px 22px 8px" },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.75)", marginBottom: 10,
  },
  hlGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8,
  },
  hlBlock: {
    borderRadius: 12, border: "1px solid",
    padding: "10px 10px 10px 9px",
  },
  hlTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 7, gap: 4,
  },
  hlTopLeft: { display: "flex", alignItems: "center", gap: 5, minWidth: 0 },
  hlName: {
    fontSize: 11, fontWeight: 700, color: "#F1F5F9",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  hlDelta: {
    fontSize: 10, fontWeight: 800, padding: "2px 6px",
    borderRadius: 5, flexShrink: 0,
  },
  hlBullets: { display: "flex", flexDirection: "column", gap: 4 },
  hlBullet:  { display: "flex", alignItems: "flex-start", gap: 5 },
  hlBulletText: { fontSize: 10, color: "#94A3B8", lineHeight: 1.35, fontWeight: 500 },

  /* CARD FOOTER */
  cardFooter: {
    display: "flex", justifyContent: "space-between",
    padding: "11px 22px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: 10,
  },
  footerCta: { color: "#6366F1", fontWeight: 700 },
  footerUrl: { color: "rgba(255,255,255,0.16)" },

  /* DEFICIT BANNER */
  banner: {
    display: "flex", alignItems: "flex-start", gap: 16,
    borderRadius: 18, border: "2px solid",
    padding: "20px 22px", marginBottom: 16,
  },
  bannerNum: {
    fontSize: "clamp(32px, 7vw, 42px)", fontWeight: 900,
    letterSpacing: "-0.04em", lineHeight: 1, flexShrink: 0, alignSelf: "center",
  },
  bannerBody: { flex: 1 },
  bannerTitle: {
    fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em",
    lineHeight: 1.3, marginBottom: 6,
  },
  bannerSub: { fontSize: 13, fontWeight: 500, marginBottom: 8 },
  bannerPunch: { fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" },

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
    background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)",
  },
};
