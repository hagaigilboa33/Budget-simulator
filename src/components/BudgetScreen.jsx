import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVENUE        = 613;
const GDP            = 2420;
const GOV_DEFICIT    = 3.4;
const MIN_BUDGET     = 580;
const MAX_BUDGET     = 820;
const STEP       = 5;
const REVENUE_PCT        = ((REVENUE - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
const DEFICIT_TARGET     = 694;
const DEFICIT_GAP        = DEFICIT_TARGET - REVENUE; // 81
const DEFICIT_TARGET_PCT = ((DEFICIT_TARGET - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

/* Cynical comments by gap (budget - 613) */
const SLIDER_COMMENTS = {
  withinTarget: [
    { threshold: 5,  text: "יש לך, יש לך. קצת גירעון עוד לא הרג אף אחד" },
    { threshold: 30, text: "אפשר לשפוך עוד קצת כסף - הכלכלה תחייך" },
    { threshold: 60, text: "מתקרב.ת ליעד הגירעון. אם היית שותה, היינו אומרים לעבור למים" },
    { threshold: 78, text: "שלושה מיליארד מהתקרה. מרגיש את הלחץ?" },
  ],
  increase: [
    { threshold: 5,   text: "יאללה מסיבה 🎉 מוציאים כסף" },
    { threshold: 20,  text: "שוקולד לכולם. מישהו ישלם את החשבון 🍫" },
    { threshold: 40,  text: "הממשלה הנוכחית כבר ניסתה בדיוק את זה. טוב, נו 😏" },
    { threshold: 70,  text: "כבר לא תקציב — זה פנטזיה מספרית ✨" },
    { threshold: 100, text: "ארגנטינה פשטה רגל על פחות מזה. אבל תמשיך" },
    { threshold: 140, text: "כלכלנים מסביבך בוכים בשקט 😢" },
    { threshold: 170, text: "בשלב הזה הדפסת כסף נשמעת כמו אופציה הגיונית 🖨️" },
  ],
  decrease: [
    { threshold: 5,   text: "שמרן קצת. בנק ישראל שר לכבודך 🏦" },
    { threshold: 15,  text: "המספריים של אדוארד — הגרסה הישראלית" },
    { threshold: 25,  text: "שמרן כמו שוויץ — בלי האלפים 🇨🇭" },
    { threshold: 33,  text: "חותך ללא רחם, קרן המטבע על ענן" },
  ],
};

function getSliderComment(gap) {
  if (gap === 0) return null;
  let list;
  if (gap < 0)                list = SLIDER_COMMENTS.decrease;
  else if (gap <= DEFICIT_GAP) list = SLIDER_COMMENTS.withinTarget;
  else                        list = SLIDER_COMMENTS.increase;
  const abs = Math.abs(gap);
  let best  = null;
  for (const item of list) {
    if (abs >= item.threshold) best = item;
  }
  return best;
}

const FINANCING = [
  {
    id: "taxes",
    emoji: "💰",
    label: "אעלה מיסים",
    cynical: "ישראל כבר בעשירייה הגבוהה של OECD בנטל מס. אבל בטח יש עוד מקום.",
  },
  {
    id: "loans",
    emoji: "🏦",
    label: "אקח הלוואות",
    cynical: "הריבית כבר עולה 65 מיליארד שקל בשנה. הדור הבא ישלם — הם עוד לא מצביעים.",
  },
];

export default function BudgetScreen({ onBudgetSet }) {
  const [budget,   setBudget]   = useState(REVENUE);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const gap           = budget - REVENUE;
  const deficit       = parseFloat(((budget - REVENUE) / GDP * 100).toFixed(1));
  const deficitColor  = deficit < 0 ? "#10B981" : deficit < GOV_DEFICIT ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";
  const isOver        = gap > 0;
  const isOverTarget  = gap > DEFICIT_GAP;
  const showWarnBlink = isOverTarget;
  const pct           = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  /* ── Slider drag ── */
  const computeVal = clientX => {
    const r   = trackRef.current.getBoundingClientRect();
    const raw = MIN_BUDGET + Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (MAX_BUDGET - MIN_BUDGET);
    return Math.round(raw / STEP) * STEP;
  };

  const onMouseDown = e => {
    e.preventDefault();
    dragging.current = true;
    setBudget(computeVal(e.clientX));
    const mm = e => { if (dragging.current) setBudget(computeVal(e.clientX)); };
    const mu = () => { dragging.current = false; window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
  };

  const onTouchStart = e => {
    dragging.current = true;
    setBudget(computeVal(e.touches[0].clientX));
    const tm = e => { if (dragging.current) setBudget(computeVal(e.touches[0].clientX)); };
    const tu = () => { dragging.current = false; window.removeEventListener("touchmove", tm); window.removeEventListener("touchend", tu); };
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", tu);
  };

  /* ── Flow ── */
  const handleProceed = () => {
    if (isOver) setShowModal(true);
    else onBudgetSet(budget, null);
  };

  const handleFinancing = opt => {
    setSelected(opt);
    setTimeout(() => onBudgetSet(budget, opt.id), 4000);
  };

  return (
    <div style={S.root}>
      <div style={S.bgGrad} />
      <div style={S.bgGrid} />

      <div style={S.shell}>

        {/* Nav */}
        <div style={S.nav}>
          <div style={S.navBrand}>
            <span style={S.navLogo}>כלכליסט</span>
            <span style={S.navDot} />
            <span style={S.navSub}>בחירות 2026</span>
          </div>
          <span style={S.navStep}>שלב 1 מתוך 2</span>
        </div>

        {/* Title */}
        <motion.div
          style={S.titleBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div style={S.eyebrow}>שר האוצר, הגיעה השאלה הגדולה:</div>
          <div style={S.title}>מה גודל התקציב שלך?</div>
          <div style={S.subtitle}>כמה תוציאו בשנת 2027?</div>
        </motion.div>

        {/* Big number */}
        <motion.div
          style={S.bigNumWrap}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.div
            key={budget}
            style={{ ...S.bigNum, color: isOverTarget ? "#EF4444" : isOver ? "#F59E0B" : "#f8fafc" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            {budget}
          </motion.div>
          <div style={S.bigNumSub}>מיליארד ₪</div>
          {budget === REVENUE && <div style={S.bigNumNote}>* צפי הכנסות המדינה ב-2027</div>}

          {/* Cynical comment */}
          <div style={S.commentSlot}>
            <AnimatePresence mode="wait">
              {getSliderComment(gap) && (
                <motion.div
                  key={getSliderComment(gap).text}
                  style={{ ...S.comment, color: isOverTarget ? "#FCA5A5" : isOver ? "#6EE7B7" : "#6EE7B7" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {getSliderComment(gap).text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ position: "relative", paddingTop: 36 }}
        >
          {/* Revenue badge — floats above track */}
          <div style={{
            position: "absolute",
            left: `${REVENUE_PCT}%`,
            top: 0,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 4,
          }}>
            <div style={S.notchBadge}>
              <span style={S.notchBadgeTop}>צפי הכנסות ל-2027</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, direction: "rtl" }}>
                <span style={S.notchBadgeNum}>{REVENUE}</span>
                <span style={S.notchBadgeLabel}>מיליארד שקל</span>
              </div>
            </div>
            <div style={S.notchConnector} />
          </div>

          <div
            ref={trackRef}
            style={S.track}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            {/* Groove */}
            <div style={S.groove} />

            {/* Fill */}
            <motion.div
              style={{ ...S.fill, background: isOverTarget ? "#EF4444" : isOver ? "#F59E0B" : "#6366F1" }}
              animate={{ width: `${pct}%`, boxShadow: isOverTarget ? "0 0 14px #EF444455" : isOver ? "0 0 14px #F59E0B55" : "0 0 14px #6366F155" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />

            {/* Revenue notch pip */}
            <div style={{
              position: "absolute",
              left: `${REVENUE_PCT}%`,
              top: "50%",
              transform: "translateX(-50%) translateY(-50%)",
              width: 3,
              height: 18,
              borderRadius: 1.5,
              background: "rgba(16,185,129,0.85)",
              boxShadow: "0 0 8px rgba(16,185,129,0.3)",
              zIndex: 3,
              pointerEvents: "none",
            }} />

            {/* Deficit target notch pip — visible only when over target */}
            {isOverTarget && <div style={{
              position: "absolute",
              left: `${DEFICIT_TARGET_PCT}%`,
              top: "50%",
              transform: "translateX(-50%) translateY(-50%)",
              width: 3,
              height: 18,
              borderRadius: 1.5,
              background: "rgba(239,68,68,0.85)",
              boxShadow: "0 0 8px rgba(239,68,68,0.3)",
              zIndex: 3,
              pointerEvents: "none",
            }} />}

            {/* Thumb */}
            <motion.div
              style={S.thumb}
              animate={{ left: `calc(${pct}% - 14px)` }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.92 }}
            />
          </div>

          <div style={S.sliderEnds}>
            <span dir="ltr" style={S.sliderEndText}>{MIN_BUDGET} מיליארד</span>
            <span dir="ltr" style={S.sliderEndText}>{MAX_BUDGET} מיליארד</span>
          </div>
        </motion.div>

        {/* Status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showWarnBlink ? "over-target-blink" : isOver ? "over" : gap < 0 ? "under" : "zero"}
            style={{
              ...S.statusBar,
              background: isOverTarget ? "rgba(239,68,68,0.1)" : isOver ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.1)",
              border: `1px solid ${isOverTarget ? "rgba(239,68,68,0.3)" : isOver ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.3)"}`,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {showWarnBlink ? (
              <motion.span
                style={{ color: "#EF4444", display: "inline-block" }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
              >
                ⚠ חצית את יעד הגירעון - 3.4%. עצור בצד
              </motion.span>
            ) : isOver ? (
              <span style={{ color: "#F59E0B" }}>
                ✓ ההוצאות גבוהות מההכנסות ב-{gap} מיליארד — עדיין בתוך יעד הגירעון
              </span>
            ) : gap === 0 ? (
              <span style={{ color: "#10B981" }}>✓ תקציב מאוזן — עומד בהכנסות הצפויות לשנת 2027</span>
            ) : (
              <span style={{ color: "#10B981" }}>✓ מתחת להכנסות ב-{Math.abs(gap)} מיליארד — תקציב שמרני</span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          style={S.cta}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(99,102,241,0.5)" }}
          whileTap={{ scale: 0.975 }}
          onClick={handleProceed}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          קדימה לחלוקת התקציב →
        </motion.button>

      </div>

      {/* Financing Modal */}
      <AnimatePresence>
        {showModal && (
          <FinancingModal gap={gap} selected={selected} onSelect={handleFinancing} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────
   FINANCING MODAL
───────────────────────────────────── */
function FinancingModal({ gap, selected, onSelect }) {
  return (
    <motion.div
      style={S.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={S.modal}
        initial={{ opacity: 0, scale: 0.9, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={S.modalBigEmoji}>💸</div>
              <div style={S.modalTitle}>חסרים לך {gap} מיליארד שקל</div>
              <div style={S.modalSub}>איך תממן את החור בתקציב?</div>
              <div style={S.optionsList}>
                {FINANCING.map(opt => (
                  <motion.button
                    key={opt.id}
                    style={S.optionBtn}
                    whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(opt)}
                  >
                    <span style={S.optionEmoji}>{opt.emoji}</span>
                    <span style={S.optionLabel}>{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cynical"
              style={S.cynicalWrap}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={S.cynicalEmoji}>{selected.emoji}</div>
              <div style={S.cynicalChoice}>{selected.label}</div>
              <div style={S.cynicalText}>{selected.cynical}</div>
              <motion.div
                style={S.cynicalBar}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4.0, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const S = {
  root: {
    minHeight: "100vh",
    background: "#030507",
    position: "relative",
    overflow: "hidden",
    padding: "0 0 60px",
  },
  bgGrad: {
    position: "fixed", inset: 0, pointerEvents: "none",
    background: [
      "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(99,102,241,0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse 50% 50% at 20% 90%, rgba(16,185,129,0.08) 0%, transparent 60%)",
    ].join(", "),
  },
  bgGrid: {
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  },

  shell: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 10,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 0 22px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 36,
  },
  navBrand: { display: "flex", alignItems: "center", gap: 8 },
  navLogo:  { fontSize: 14, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" },
  navDot:   { width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.25)" },
  navSub:   { fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 },
  navStep:  { fontSize: 11, fontWeight: 700, color: "rgba(99,102,241,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" },

  titleBlock: { marginBottom: 28, textAlign: "center" },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: 10,
  },
  title: {
    fontSize: "clamp(26px, 6vw, 38px)", fontWeight: 900,
    color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.3)", fontWeight: 400 },

  bigNumWrap: { textAlign: "center", marginBottom: 36 },
  bigNum: {
    fontSize: "clamp(80px, 18vw, 130px)",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    transition: "color 0.3s",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  bigNumSub: { fontSize: 15, color: "rgba(255,255,255,0.25)", fontWeight: 500, marginTop: 6 },
  bigNumNote: { fontSize: 11, color: "rgba(99,102,241,0.6)", fontWeight: 500, marginTop: 4, letterSpacing: "0.02em" },
  commentSlot: { minHeight: 28, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  comment: { fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.4 },

  /* Slider */
  track: {
    position: "relative",
    height: 52,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    touchAction: "none",
    direction: "ltr",
    marginBottom: 8,
  },
  groove: {
    position: "absolute", left: 0, right: 0,
    height: 6, borderRadius: 100,
    background: "rgba(255,255,255,0.08)",
  },
  fill: {
    position: "absolute", top: "50%",
    transform: "translateY(-50%)",
    left: 0, height: 6, borderRadius: 100,
  },
  notchBadge: {
    background: "rgba(16,185,129,0.07)",
    border: "1px solid rgba(16,185,129,0.22)",
    borderRadius: 8,
    padding: "5px 12px",
    textAlign: "center",
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  notchBadgeTop: {
    fontSize: 12, fontWeight: 700,
    letterSpacing: "0.02em", color: "rgba(16,185,129,0.85)",
  },
  notchBadgeNum: {
    fontSize: 22, fontWeight: 900, color: "rgba(16,185,129,1)",
    letterSpacing: "-0.02em",
  },
  notchBadgeLabel: {
    fontSize: 14, fontWeight: 600, color: "rgba(16,185,129,0.9)",
    letterSpacing: "0.01em",
  },
  notchConnector: {
    width: 1, height: 12,
    background: "rgba(16,185,129,0.28)",
  },
  thumb: {
    position: "absolute",
    width: 28, height: 28,
    borderRadius: "50%",
    background: "#fff",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 5,
    cursor: "grab",
    border: "2.5px solid rgba(255,255,255,0.95)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.35), 0 4px 16px rgba(0,0,0,0.6)",
  },
  sliderEnds: {
    display: "flex",
    justifyContent: "space-between",
    direction: "ltr",
    marginBottom: 14,
  },
  sliderEndText: { fontSize: 11, color: "rgba(255,255,255,0.18)", fontWeight: 500 },
  sliderHint: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    fontWeight: 500,
    marginBottom: 10,
    letterSpacing: "0.02em",
  },

  statusBar: {
    padding: "12px 18px",
    borderRadius: 14,
    fontSize: 13, fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: 16,
    textAlign: "center",
  },

  deficitRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 0, marginBottom: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 20px",
  },
  deficitChip: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
  },
  deficitDivider: {
    width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.08)", margin: "0 16px",
  },
  deficitChipLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
  },
  deficitChipVal: {
    fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
  },

  cta: {
    width: "100%",
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A855F7 100%)",
    color: "#fff",
    fontSize: 17, fontWeight: 700,
    padding: "17px 32px",
    borderRadius: 16, border: "none",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    boxShadow: "0 4px 24px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.12) inset",
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: "opacity 0.2s",
  },

  /* Modal */
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)",
    backdropFilter: "blur(14px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "linear-gradient(160deg, #0A0F1E 0%, #0D1422 60%, #0F1628 100%)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: "36px 28px 32px",
    width: "100%",
    maxWidth: 420,
    textAlign: "center",
    boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
    overflow: "hidden",
    position: "relative",
  },
  modalBigEmoji: { fontSize: 52, marginBottom: 16, lineHeight: 1 },
  modalTitle: {
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: 900,
    color: "#f1f5f9",
    letterSpacing: "-0.03em",
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 28,
    fontWeight: 400,
  },
  optionsList: { display: "flex", flexDirection: "column", gap: 12 },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 22px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "right",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  optionEmoji: { fontSize: 26, flexShrink: 0 },
  optionLabel: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" },

  /* Cynical response */
  cynicalWrap: { padding: "4px 0" },
  cynicalEmoji: { fontSize: 44, marginBottom: 14, lineHeight: 1 },
  cynicalChoice: {
    fontSize: 20, fontWeight: 900,
    color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 16,
  },
  cynicalText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.75,
    fontWeight: 400,
    marginBottom: 24,
  },
  cynicalBar: {
    height: 3,
    background: "linear-gradient(90deg, #6366F1, #A855F7)",
    borderRadius: 2,
    transformOrigin: "left center",
    margin: "0 -28px -32px",
  },
};
