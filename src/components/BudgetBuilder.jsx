import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, getInsight, calcDeficit } from "../data/budgetData";

const GAME_SECONDS = 120;

/* ─────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────── */
function useCountdown(total, onTimeout) {
  const [left, setLeft] = useState(total);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(t => {
        if (t <= 1) { clearInterval(ref.current); onTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, []);
  return left;
}

/* ─────────────────────────────────────
   MAIN
───────────────────────────────────── */
export default function BudgetBuilder({ values, setValues, onFinish, onTimeout, name }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [insight,    setInsight]    = useState(null);
  const [flash,      setFlash]      = useState(null);
  const timer          = useRef(null);
  const flashTimer     = useRef(null);
  const currentCatIdRef = useRef(CATEGORIES[0].id);

  const timeLeft  = useCountdown(GAME_SECONDS, onTimeout);
  const isUrgent  = timeLeft <= 10;
  const deficit   = parseFloat(calcDeficit(values));
  const govDeficit = 4.9;
  const cat       = CATEGORIES[currentIdx];
  const isLast    = currentIdx === CATEGORIES.length - 1;

  const triggerFlash = (level) => {
    clearTimeout(flashTimer.current);
    setFlash(level);
    flashTimer.current = setTimeout(() => setFlash(null), 900);
  };

  const handleChange = useCallback((raw, catId) => {
    if (catId !== currentCatIdRef.current) return; // stale slider call — ignore
    const cat   = CATEGORIES.find(c => c.id === catId);
    const val   = Math.round(Math.max(cat.min, Math.min(cat.max, raw)));
    const delta = val - cat.current;
    setValues(prev => ({ ...prev, [cat.id]: val }));
    const ins = getInsight(cat, delta);
    if (ins) {
      clearTimeout(timer.current);
      setInsight({ text: ins.text, emoji: cat.emoji, color: cat.color, severity: ins.severity, id: Date.now() });
      timer.current = setTimeout(() => setInsight(null), 5500);
      if (delta < 0) {
        if (ins.severity === "critical") triggerFlash("critical");
        else if (ins.severity === "warning") triggerFlash("warning");
      }
    }
  }, [setValues]);

  const handleNext = () => {
    if (!isLast) { setCurrentIdx(i => i + 1); } else { onFinish(); }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  // Clear insight whenever the user navigates to a new category
  useEffect(() => {
    currentCatIdRef.current = CATEGORIES[currentIdx].id;
    setInsight(null);
    clearTimeout(timer.current);
  }, [currentIdx]);

  useEffect(() => () => {
    clearTimeout(timer.current);
    clearTimeout(flashTimer.current);
  }, []);

  const flashColor = flash === "critical"
    ? "rgba(239,68,68,0.28)"
    : flash === "warning"
    ? "rgba(245,158,11,0.18)"
    : null;

  return (
    <div style={{ ...css.page, background: isUrgent ? "rgba(10,0,0,1)" : "#070B14" }}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      {/* Screen flash */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            key={flash + Date.now()}
            style={css.flashOverlay}
            initial={{ opacity: 1, backgroundColor: flashColor }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Toast portal — top center */}
      <div style={css.toastPortal}>
        <AnimatePresence mode="wait">
          {insight && <InsightToast key={insight.id} insight={insight} />}
        </AnimatePresence>
      </div>

      <div style={css.shell}>

        {/* Nav */}
        <motion.header
          style={css.nav}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={css.navBrand}>
            <span style={css.navLogo}>כלכליסט</span>
            <span style={css.navDot} />
            <span style={css.navSub}>בחירות 2026</span>
          </div>
          <LiveBadge deficit={deficit} />
        </motion.header>

        {/* ── BIG TIMER ── */}
        <BigTimer timeLeft={timeLeft} total={GAME_SECONDS} urgent={isUrgent} name={name} />

        {/* Progress dots */}
        <div style={css.progressRow}>
          <span style={css.progressLabel}>סעיף {currentIdx + 1} מתוך {CATEGORIES.length}</span>
          <div style={css.dots}>
            {CATEGORIES.map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...css.dot,
                  background: i < currentIdx ? "#6366F1"
                            : i === currentIdx ? "#fff"
                            : "rgba(255,255,255,0.15)",
                }}
                animate={{ width: i === currentIdx ? 22 : 8 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            ))}
          </div>
        </div>

        {/* Category card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <CategoryCard
              cat={cat}
              value={values[cat.id]}
              onChange={handleChange}
            />
          </motion.div>
        </AnimatePresence>

        {/* Back / Next buttons */}
        <div style={css.btnRow}>
          {currentIdx > 0 && (
            <motion.button
              style={css.backBtn}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={handleBack}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              ← חזרה
            </motion.button>
          )}
          <motion.button
            style={{
              ...css.nextBtn,
              flex: 1,
              background: isLast
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: isLast
                ? "0 4px 24px rgba(16,185,129,0.4)"
                : "0 4px 24px rgba(99,102,241,0.4)",
            }}
            whileHover={{ scale: 1.015, boxShadow: "0 12px 40px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.985 }}
            onClick={handleNext}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {isLast ? "סיים — ראה את הכרטיס שלי ✓" : "הבא →"}
          </motion.button>
        </div>

        {/* Deficit compare */}
        <DeficitBar deficit={deficit} govDeficit={govDeficit} />

      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   BIG TIMER
───────────────────────────────────── */
function BigTimer({ timeLeft, total, urgent, name }) {
  const pct   = (timeLeft / total) * 100;
  const color = urgent ? "#EF4444" : timeLeft < 20 ? "#F59E0B" : "#6366F1";
  const mm    = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const ss    = String(timeLeft % 60).padStart(2, "0");

  return (
    <motion.div
      style={css.timerBlock}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div style={css.timerTopRow}>
        <span style={css.timerSubLabel}>
          {urgent ? `⚠ ${name}, הזמן נגמר!` : "זמן שלטון נותר"}
        </span>
        <motion.span
          style={{ ...css.timerNum, color }}
          animate={urgent ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={urgent ? { duration: 0.55, repeat: Infinity } : {}}
        >
          {mm}:{ss}
        </motion.span>
      </div>
      <div style={css.timerTrackWrap}>
        <motion.div
          style={{
            height: "100%",
            borderRadius: 100,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: urgent ? `0 0 18px ${color}88` : "none",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.95, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   LIVE BADGE
───────────────────────────────────── */
function LiveBadge({ deficit }) {
  const color = deficit < 3.5 ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";
  return (
    <motion.div
      style={{ ...css.liveBadge, borderColor: color + "50", background: color + "14" }}
      key={Math.round(deficit * 10)}
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <span style={{ ...css.liveDot, background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ ...css.liveNum, color }}>גירעון {deficit}%</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   CATEGORY CARD
───────────────────────────────────── */
function CategoryCard({ cat, value, onChange }) {
  const delta     = Math.round(value - cat.current);
  const isChanged = Math.abs(delta) >= 1;
  const isUp      = delta > 0;
  const defColor  = cat.color;

  return (
    <div style={{ ...css.catCard, borderColor: defColor + "30" }}>
      {/* Header */}
      <div style={css.catHeader}>
        <div style={css.catHeaderLeft}>
          <div style={{ ...css.catEmojiWrap, background: defColor + "18", border: `1.5px solid ${defColor}30` }}>
            <span style={css.catEmoji}>{cat.emoji}</span>
          </div>
          <div>
            <div style={css.catName}>{cat.label}</div>
            <div style={css.catGovLine}>
              ממשלה: <span dir="ltr" style={{ color: "#64748B", fontWeight: 600 }}>{cat.current} מיליארד</span>
            </div>
          </div>
        </div>
        <div style={css.catValueBox}>
          <motion.div
            key={value}
            style={{
              ...css.catValueNum,
              color: !isChanged ? "var(--text-2)" : isUp ? "#34D399" : "#F87171",
              display: "flex", alignItems: "baseline", direction: "ltr", gap: 6,
            }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <span>{value}</span>
            <span style={{ fontSize: "0.5em", fontWeight: 600 }}>מיליארד</span>
          </motion.div>
          <AnimatePresence>
            {isChanged && (
              <motion.div
                style={{
                  ...css.catDelta,
                  color:      isUp ? "#34D399" : "#F87171",
                  background: isUp ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                  border:     `1px solid ${isUp ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span style={{ display: "flex", alignItems: "baseline", direction: "ltr", gap: 3 }}>
                  <span>{isUp ? "+" : ""}{delta}</span>
                  <span style={{ fontSize: "0.85em" }}>מיליארד</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slider */}
      <BigSlider cat={cat} value={value} onChange={onChange} />

      {/* Range labels */}
      <div style={{ display: "flex", justifyContent: "space-between", direction: "ltr", marginTop: 10 }}>
        <span dir="ltr" style={css.rangeLabel}>{cat.min} מיליארד</span>
        <span dir="ltr" style={{ ...css.rangeLabel, color: "#334155" }}>▲ {cat.current} מיליארד</span>
        <span dir="ltr" style={css.rangeLabel}>{cat.max} מיליארד</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   BIG SLIDER
───────────────────────────────────── */
function BigSlider({ cat, value, onChange }) {
  const pct    = ((value - cat.min) / (cat.max - cat.min)) * 100;
  const govPct = ((cat.current - cat.min) / (cat.max - cat.min)) * 100;
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const getVal = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    return cat.min + Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (cat.max - cat.min);
  };

  const onMouseDown = e => {
    e.preventDefault();
    dragging.current = true;
    onChange(getVal(e.clientX), cat.id);
    const mm = e => { if (dragging.current) onChange(getVal(e.clientX), cat.id); };
    const mu = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
    };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
  };

  const onTouchStart = e => {
    dragging.current = true;
    onChange(getVal(e.touches[0].clientX), cat.id);
    const tm = e => { if (dragging.current) onChange(getVal(e.touches[0].clientX), cat.id); };
    const tu = () => {
      dragging.current = false;
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", tu);
    };
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", tu);
  };

  return (
    <div
      ref={trackRef}
      style={css.bigTrack}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Groove */}
      <div style={css.bigGroove} />

      {/* Fill */}
      <motion.div
        style={{ ...css.bigFill, background: cat.color }}
        animate={{ width: `${pct}%`, boxShadow: `0 0 12px ${cat.color}66` }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      />

      {/* Gov notch */}
      <div style={{ ...css.govNotch, left: `${govPct}%` }}>
        <div style={{ ...css.govPip, background: cat.color + "80" }} />
      </div>

      {/* Thumb */}
      <motion.div
        style={{ ...css.bigThumb, boxShadow: `0 0 0 3px ${cat.color}55, 0 4px 16px rgba(0,0,0,0.6)` }}
        animate={{ left: `calc(${pct}% - 14px)` }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.92 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   DEFICIT BAR (bottom)
───────────────────────────────────── */
function DeficitBar({ deficit, govDeficit }) {
  const color  = deficit < 3.5 ? "#10B981" : deficit < 5.5 ? "#F59E0B" : "#EF4444";
  const isGood = deficit < govDeficit;
  return (
    <motion.div
      style={css.defBar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <span style={{ color, fontWeight: 700 }}>גירעון: {deficit}%</span>
      <span style={css.defBarSep}>·</span>
      <span style={{ color: "#475569" }}>ממשלה: {govDeficit}%</span>
      <span style={{ color: isGood ? "#34D399" : "#F87171", fontSize: 11, fontWeight: 600 }}>
        {isGood ? `▼ ${Math.abs(deficit - govDeficit).toFixed(1)}% מתחת` : `▲ ${Math.abs(deficit - govDeficit).toFixed(1)}% מעל`}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   INSIGHT TOAST
───────────────────────────────────── */
function InsightToast({ insight }) {
  const isCritical = insight.severity === "critical";
  const isWarning  = insight.severity === "warning";
  const borderCol  = isCritical ? "#EF4444" : isWarning ? "#F59E0B" : insight.color;

  return (
    <motion.div
      style={{
        ...css.toast,
        borderColor: borderCol + "60",
        borderRight: `3px solid ${borderCol}`,
      }}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{   opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <div style={css.toastInner}>
        <span style={{ fontSize: 26, flexShrink: 0, marginTop: 1 }}>{insight.emoji}</span>
        <span style={{
          ...css.toastText,
          color: isCritical ? "#FCA5A5" : isWarning ? "#FCD34D" : "var(--text-2)",
        }}>
          {isCritical && <span style={css.toastBadge}>⚠ חריג · </span>}
          {insight.text}
        </span>
      </div>
      <motion.div
        style={{ ...css.toastProgress, background: borderCol }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5.5, ease: "linear" }}
      />
    </motion.div>
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
    padding: "0 0 140px",
    transition: "background 0.5s",
  },
  flashOverlay: {
    position: "fixed", inset: 0,
    zIndex: 200, pointerEvents: "none",
  },
  toastPortal: {
    position: "fixed",
    top: 16, left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 32px)",
    maxWidth: 660,
    zIndex: 150,
  },
  toast: {
    background: "rgba(8,10,18,0.98)",
    border: "1px solid",
    borderRadius: 16,
    overflow: "hidden",
    backdropFilter: "blur(24px)",
    boxShadow: "0 12px 60px rgba(0,0,0,0.7)",
  },
  toastInner: {
    display: "flex", alignItems: "flex-start",
    gap: 14, padding: "18px 20px",
  },
  toastText: { fontSize: 16, lineHeight: 1.6, fontWeight: 600 },
  toastBadge: { fontWeight: 900, fontSize: 13, letterSpacing: "0.03em" },
  toastProgress: { height: 3, transformOrigin: "left center", borderRadius: 0 },

  shell: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 10,
  },

  /* Nav */
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 0 22px",
    borderBottom: "1px solid var(--border)",
    marginBottom: 28,
  },
  navBrand: { display: "flex", alignItems: "center", gap: 8 },
  navLogo:  { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" },
  navDot:   { width: 4, height: 4, borderRadius: "50%", background: "var(--text-3)", flexShrink: 0 },
  navSub:   { fontSize: 12, color: "var(--text-3)", fontWeight: 500 },

  liveBadge: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 12px", borderRadius: 100, border: "1px solid",
  },
  liveDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  liveNum: { fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em" },

  /* Big timer */
  timerBlock: {
    marginBottom: 28,
    padding: "20px 22px",
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
  },
  timerTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
    direction: "ltr",
  },
  timerSubLabel: {
    fontSize: 12, fontWeight: 600,
    color: "var(--text-3)", letterSpacing: "0.06em",
    textTransform: "uppercase",
    direction: "rtl",
  },
  timerNum: {
    fontSize: "clamp(48px, 10vw, 72px)",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    transition: "color 0.4s",
  },
  timerTrackWrap: {
    height: 8,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 100,
    overflow: "hidden",
    direction: "ltr",
  },

  /* Progress */
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12, fontWeight: 600, color: "var(--text-3)",
  },
  dots: {
    display: "flex", alignItems: "center", gap: 5,
    direction: "ltr",
  },
  dot: {
    height: 8, borderRadius: 100,
    transition: "background 0.3s",
  },

  /* Category card */
  catCard: {
    background: "var(--surface)",
    border: "1px solid",
    borderRadius: 20,
    padding: "24px 22px 20px",
    marginBottom: 16,
  },
  catHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    gap: 12,
  },
  catHeaderLeft: { display: "flex", alignItems: "center", gap: 14 },
  catEmojiWrap: {
    width: 52, height: 52,
    borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  catEmoji: { fontSize: 26, lineHeight: 1 },
  catName: {
    fontSize: "clamp(18px, 4vw, 22px)",
    fontWeight: 800,
    color: "var(--text-1)",
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    marginBottom: 4,
  },
  catGovLine: {
    fontSize: 12, color: "var(--text-3)", fontWeight: 400,
  },
  catValueBox: {
    display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5,
    flexShrink: 0,
  },
  catValueNum: {
    fontSize: "clamp(28px, 6vw, 36px)",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    transition: "color 0.25s",
  },
  catDelta: {
    fontSize: 12, fontWeight: 700,
    padding: "3px 10px", borderRadius: 100,
    letterSpacing: "0.01em",
  },

  /* Big slider */
  bigTrack: {
    position: "relative",
    height: 36,
    display: "flex", alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    touchAction: "none",
    direction: "ltr",
  },
  bigGroove: {
    position: "absolute", left: 0, right: 0,
    height: 6, borderRadius: 100,
    background: "rgba(255,255,255,0.08)",
  },
  bigFill: {
    position: "absolute", top: "50%",
    transform: "translateY(-50%)",
    left: 0, height: 6, borderRadius: 100,
  },
  govNotch: {
    position: "absolute", top: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  govPip: { width: 3, height: 18, borderRadius: 2 },
  bigThumb: {
    position: "absolute",
    width: 28, height: 28,
    borderRadius: "50%",
    background: "#fff",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 5,
    cursor: "grab",
    border: "2.5px solid rgba(255,255,255,0.95)",
  },

  rangeLabel: { fontSize: 11, color: "var(--text-4)", fontWeight: 500 },

  /* Button row */
  btnRow: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },

  /* Back button */
  backBtn: {
    padding: "17px 22px",
    color: "var(--text-2)",
    fontSize: 15, fontWeight: 700,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  /* Next button */
  nextBtn: {
    padding: "17px 32px",
    color: "#fff",
    fontSize: 17, fontWeight: 700,
    borderRadius: 16, border: "none",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    transition: "all 0.2s",
  },

  /* Deficit bar */
  defBar: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 12, flexWrap: "wrap",
    fontSize: 13, fontWeight: 500,
    color: "var(--text-3)",
    padding: "12px 0 0",
  },
  defBarSep: { color: "rgba(255,255,255,0.15)" },
};
