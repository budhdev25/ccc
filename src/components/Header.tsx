import { useTheme } from "../hooks/useTheme";
import { useSession } from "../hooks/useSession";
import { useTavus } from "../hooks/useTavus";
import { useViewport } from "../hooks/useViewport";
import type { ViewId } from "../lib/types";

const VIEW_TITLE: Record<ViewId, string> = {
  clinical: "Clinical Assistant",
  schedule: "Schedule",
  cme: "CME / CE",
  medsights: "Medsights",
  concierge: "Patient Concierge Insights",
  scribe: "Scribe Output",
  docs: "Recent Documents",
};

export function Header() {
  const { C, dark, toggle } = useTheme();
  const { view, setSessionMode, setMobileNavOpen } = useSession();
  const { sec, fmt } = useTavus();
  const { isMobile } = useViewport();

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 10px" : "0 20px", height: 48, background: `linear-gradient(180deg, ${C.bgCard} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, flexShrink: 0, boxShadow: C.shadowSoft, gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, minWidth: 0 }}>
        {isMobile && (
          <button onClick={() => setMobileNavOpen((v) => !v)} aria-label="Open navigation menu" style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.borderSubtle}`, background: C.bgEl, color: C.text, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>☰</button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", boxShadow: `0 2px 8px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.25)`, letterSpacing: "-0.02em", flexShrink: 0 }}>C³</div>
          {!isMobile && <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.015em" }}>Clinical<span style={{ color: C.accent }}>Command</span>Center</span>}
        </div>
        {!isMobile && <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, background: C.accentDim, border: `1px solid ${C.borderAcc}50`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em", fontFamily: C.mono }}>v8.2</span>}
        {!isMobile && <div style={{ width: 1, height: 18, background: C.border }} />}
        <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{VIEW_TITLE[view]}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, flexShrink: 0 }}>
        {!isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, boxShadow: `0 0 6px ${C.success}90` }} />
              <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Live</span>
              <span style={{ fontSize: 11, color: C.text, fontFamily: C.mono, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>{fmt(sec)}</span>
            </div>
            <div style={{ width: 1, height: 18, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>Dr. Maya Thompson</span>
          </>
        )}
        <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ display: "flex", alignItems: "center", gap: 5, padding: isMobile ? "6px 9px" : "5px 11px", borderRadius: 14, border: `1.5px solid ${C.borderAcc}60`, background: C.accentDim, color: C.accent, fontSize: isMobile ? 13 : 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}>{isMobile ? (dark ? "☀" : "🌙") : dark ? "☀ Light" : "🌙 Dark"}</button>
        {/* TODO (Phase 2): wire End → POST /api/tavus/conversations/:id/end then reset to new-session */}
        <button onClick={() => setSessionMode("new")} style={{ padding: isMobile ? "6px 11px" : "5px 13px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", border: `1px solid ${C.danger}50`, background: "rgba(224,98,98,0.08)", color: C.danger, cursor: "pointer", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase" }}>End</button>
      </div>
    </header>
  );
}
