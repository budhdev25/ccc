import { useTheme } from "../context/ThemeContext";
import { useViewport } from "../hooks/useViewport";

export function Footer() {
  const { C } = useTheme();
  const { isMobile } = useViewport();
  const dot = <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.borderSubtle, flexShrink: 0 }} />;

  // Mobile: drop to the two essentials so the bar never clips mid-word.
  if (isMobile) {
    return (
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 28, background: C.bgCard, borderTop: `1px solid ${C.borderSubtle}`, flexShrink: 0, gap: 10, padding: "0 12px", whiteSpace: "nowrap", overflow: "hidden" }}>
        <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>AI support — verify clinically</span>
        {dot}
        <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 500, flexShrink: 0 }}>🔒 HIPAA</span>
      </footer>
    );
  }

  return (
    <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 30, background: C.bgCard, borderTop: `1px solid ${C.borderSubtle}`, flexShrink: 0, gap: 14, padding: "0 20px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)", whiteSpace: "nowrap", overflow: "hidden" }}>
      <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500, letterSpacing: "0.01em" }}>AI decision support — not a substitute for clinical judgment</span>
      {dot}
      <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: C.mono, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>Glass v5.5</span>
      {dot}
      {/* Generic per HANDOFF §6 (BUILD_PLAN C-9/OD-4): no EHR partner exists yet — do not assert "Epic ✓". */}
      <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>Connected <span style={{ color: C.textDim, fontWeight: 700 }}>EHR</span></span>
      {dot}
      <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>🔒 HIPAA Compliant</span>
    </footer>
  );
}
