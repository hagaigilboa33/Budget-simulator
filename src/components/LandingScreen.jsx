import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Phases ───
  0: initial dark
  1: small status lines type
  2: big headline reveals
  3: subtext fades
  4: input+cta appear
─────────────── */

const STATUS_LINES = [
  { text: "מתחברים למשרד האוצר...", duration: 900 },
  { text: "גישה מאושרת ✓",          duration: 700, green: true },
];

export default function LandingScreen({ onStart }) {
  const [phase,        setPhase]       = useState(0);
  const [statusIdx,    setStatusIdx]   = useState(0);
  const [typedChars,   setTypedChars]  = useState(0);
  const [name,         setName]        = useState("");
  const [inputFocused, setInputFocused]= useState(false);
  const [cursor,       setCursor]      = useState(true);
  const timerRef = useRef(null);

  /* Blinking cursor */
  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  /* Phase machine */
  useEffect(() => {
    clearTimeout(timerRef.current);

    if (phase === 0) {
      timerRef.current = setTimeout(() => setPhase(1), 400);
    }

    if (phase === 1) {
      // Type current status line
      const line = STATUS_LINES[statusIdx];
      if (typedChars < line.text.length) {
        timerRef.current = setTimeout(() => setTypedChars(c => c + 1), 30);
      } else {
        // Line done — pause then next
        timerRef.current = setTimeout(() => {
          if (statusIdx < STATUS_LINES.length - 1) {
            setStatusIdx(i => i + 1);
            setTypedChars(0);
          } else {
            setPhase(2); // → big headline
          }
        }, line.duration);
      }
    }

    if (phase === 2) timerRef.current = setTimeout(() => setPhase(3), 700);
    if (phase === 3) timerRef.current = setTimeout(() => setPhase(4), 600);
  }, [phase, statusIdx, typedChars]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handle = () => name.trim() && onStart(name.trim());

  const completedLines = STATUS_LINES.slice(0, statusIdx);
  const currentLine    = STATUS_LINES[statusIdx];

  return (
    <div style={S.root}>

      {/* ── Animated BG ── */}
      <div style={S.bgGrad} />
      <div style={S.bgGrid} />

      {/* ── Big watermark number ── */}
      <div style={S.watermark} aria-hidden="true">613</div>

      {/* ── Center content ── */}
      <div style={S.center}>

        {/* Eyebrow */}
        <motion.div
          style={S.eyebrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          כלכליסט · בחירות 2026
        </motion.div>

        {/* Status lines (small typewriter) */}
        <div style={S.statusBox}>
          {completedLines.map((l, i) => (
            <div key={i} style={{ ...S.statusLine, color: l.green ? "#4ade80" : "#4b5563" }}>
              {l.text}
            </div>
          ))}
          {phase === 1 && currentLine && (
            <div style={{ ...S.statusLine, color: currentLine.green ? "#4ade80" : "#9ca3af" }}>
              {currentLine.text.slice(0, typedChars)}
              <span style={{ opacity: cursor ? 1 : 0 }}>|</span>
            </div>
          )}
        </div>

        {/* BIG headline */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              style={S.headline}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={S.headlineMain}>מונית לשר האוצר</div>
              <div style={S.headlineSub}>הבא של ישראל</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub copy */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.p
              style={S.copy}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              יש לך <strong style={{ color: "#f1f5f9" }}>613 מיליארד שקל</strong> ו-2 דקות.
              <br />קבע את סדר העדיפויות הבא של ישראל.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Input + CTA */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              style={S.inputBlock}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <input
                autoFocus
                style={{
                  ...S.input,
                  borderColor: inputFocused ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)",
                  boxShadow:   inputFocused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
                }}
                placeholder="מה שמך?"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={e => e.key === "Enter" && handle()}
                maxLength={20}
              />

              <motion.button
                style={{
                  ...S.cta,
                  opacity: name.trim() ? 1 : 0.4,
                  cursor:  name.trim() ? "pointer" : "default",
                }}
                whileHover={name.trim() ? { scale: 1.025, boxShadow: "0 10px 48px rgba(99,102,241,0.55)" } : {}}
                whileTap={name.trim() ? { scale: 0.975 } : {}}
                onClick={handle}
              >
                יאללה לתקציב
              </motion.button>

              <p style={S.disclaimer}>
                מבוסס על נתוני תקציב 2026 אמיתיים · ללא הרשמה
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

/* ─── Styles ─── */
const S = {
  root: {
    minHeight: "100vh",
    background: "#030507",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "40px 24px",
  },

  bgGrad: {
    position: "fixed", inset: 0, pointerEvents: "none",
    background: [
      "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(99,102,241,0.18) 0%, transparent 60%)",
      "radial-gradient(ellipse 50% 50% at 20% 90%, rgba(16,185,129,0.10) 0%, transparent 60%)",
    ].join(", "),
  },

  bgGrid: {
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  },

  /* Giant faded number behind everything */
  watermark: {
    position: "fixed",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "clamp(160px, 35vw, 360px)",
    fontWeight: 900,
    color: "rgba(255,255,255,0.022)",
    letterSpacing: "-0.05em",
    userSelect: "none",
    pointerEvents: "none",
    lineHeight: 1,
    fontFamily: "'Inter', system-ui, sans-serif",
    whiteSpace: "nowrap",
  },

  center: {
    position: "relative",
    zIndex: 10,
    maxWidth: 600,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(99,102,241,0.8)",
    marginBottom: 28,
  },

  statusBox: {
    fontFamily: "'Courier New', Consolas, monospace",
    fontSize: 13,
    lineHeight: 2,
    marginBottom: 20,
    minHeight: 52,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },

  statusLine: {
    letterSpacing: "0.01em",
    direction: "rtl",
  },

  /* THE BIG HEADLINE */
  headline: {
    textAlign: "center",
    marginBottom: 28,
  },
  headlineMain: {
    fontSize: "clamp(52px, 11vw, 96px)",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: 1.0,
    color: "#f8fafc",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  headlineAccent: {
    color: "rgba(248,250,252,0.35)",
    fontSize: "0.75em",
  },
  headlineSub: {
    fontSize: "clamp(40px, 8.5vw, 76px)",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.05,
    background: "linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  copy: {
    fontSize: 17,
    color: "#64748b",
    lineHeight: 1.7,
    marginBottom: 36,
    fontWeight: 400,
  },

  inputBlock: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },

  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: "15px 20px",
    fontSize: 17,
    color: "#f1f5f9",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    textAlign: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
  },

  cta: {
    width: "100%",
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A855F7 100%)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    padding: "16px 32px",
    borderRadius: 14,
    border: "none",
    letterSpacing: "-0.01em",
    boxShadow: "0 4px 24px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.12) inset",
    transition: "opacity 0.2s",
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.18)",
    letterSpacing: "0.02em",
    marginTop: 4,
  },
};
