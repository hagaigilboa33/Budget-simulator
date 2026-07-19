import { motion } from "framer-motion";

export default function FiredScreen({ name, onResult, onRestart }) {
  return (
    <div style={css.page}>
      {/* Red glow bg */}
      <div style={css.redGlow} />
      <div style={css.gridOverlay} />

      <motion.div
        style={css.center}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Stamp icon */}
        <motion.div
          style={css.stamp}
          initial={{ rotate: -15, scale: 1.8, opacity: 0 }}
          animate={{ rotate: 0,   scale: 1,   opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
        >
          📋
        </motion.div>

        {/* FIRED */}
        <motion.div
          style={css.firedText}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 240, damping: 18 }}
        >
          מפוטר!
        </motion.div>

        {/* Red underline */}
        <motion.div
          style={css.firedLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Subtitle */}
        <motion.p
          style={css.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1,  y: 0 }}
          transition={{ delay: 0.9 }}
        >
          הזמן נגמר, <strong style={{ color: "#F1F5F9" }}>{name}</strong>.<br />
          אתה מפוטר ממשרת שר האוצר.<br />
          <span style={css.subtitleMuted}>גרסת החירום של הממשלה השתלטה.</span>
        </motion.p>

        {/* Buttons */}
        <motion.div
          style={css.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            style={css.btnResult}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 36px rgba(99,102,241,0.45)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onResult}
          >
            ראה את התקציב שלך בכל זאת
          </motion.button>
          <motion.button
            style={css.btnRestart}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
          >
            ↩ נסה שוב
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

const css = {
  page: {
    minHeight: "100vh",
    background: "#060005",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "40px 24px",
  },
  redGlow: {
    position: "fixed", inset: 0, pointerEvents: "none",
    background: [
      "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(239,68,68,0.22) 0%, transparent 65%)",
      "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(239,68,68,0.08) 0%, transparent 60%)",
    ].join(", "),
  },
  gridOverlay: {
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  },
  center: {
    position: "relative", zIndex: 10,
    maxWidth: 480, width: "100%",
    textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  stamp: {
    fontSize: 72,
    marginBottom: 20,
    lineHeight: 1,
    display: "block",
  },
  firedText: {
    fontSize: "clamp(72px, 18vw, 120px)",
    fontWeight: 900,
    color: "#EF4444",
    letterSpacing: "-0.05em",
    lineHeight: 0.95,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  firedLine: {
    height: 5,
    width: "60%",
    background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
    borderRadius: 100,
    marginTop: 14,
    marginBottom: 36,
    transformOrigin: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    lineHeight: 1.7,
    marginBottom: 44,
    fontWeight: 400,
  },
  subtitleMuted: {
    fontSize: 14,
    color: "#475569",
  },
  actions: {
    display: "flex", flexDirection: "column", gap: 12, width: "100%",
  },
  btnResult: {
    padding: "17px 24px",
    borderRadius: 14, border: "none",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#fff",
    fontSize: 16, fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.01em",
    boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
    fontFamily: "inherit",
  },
  btnRestart: {
    padding: "16px 24px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#94A3B8",
    fontSize: 15, fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
