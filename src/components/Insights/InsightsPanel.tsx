import { useTheme } from "../../hooks/useTheme";
import { useSession } from "../../hooks/useSession";
import { useConsult } from "../../hooks/useConsult";
import { useViewport } from "../../hooks/useViewport";
import { DdxView } from "./DdxView";
import { TreatmentView } from "./TreatmentView";
import { ZoomControl } from "../primitives/ZoomControl";
import type { InsightTab } from "../../lib/types";

// Holds DDx + Tx tabs only — chat stays in Consult (BUILD_PLAN non-negotiables).
// Tabs are prominent and at the TOP (per owner request).
export function InsightsPanel() {
  const { C } = useTheme();
  const { getZoom } = useSession();
  const { tab, setTab, setInsightsVisible } = useConsult();
  const { isMobile } = useViewport();
  const tabs: { id: InsightTab; l: string; ct: number }[] = [
    { id: "ddx", l: "Differential Dx", ct: 5 },
    { id: "tx", l: "Treatment Plan", ct: 3 },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideInRight 0.45s cubic-bezier(0.4,0,0.2,1) forwards" }}>
      <div style={{ padding: "6px 10px 6px 14px", background: `linear-gradient(90deg, ${C.accentDim} 0%, ${C.accentDim}80 60%, transparent 100%)`, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accentGlow}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.14em" }}>Insights</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ZoomControl zoomKey="insights" label="Insights" />
          {!isMobile && (
            <button onClick={() => setInsightsVisible(false)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 5, border: `1px solid ${C.borderAcc}60`, background: C.bgCard, color: C.accent, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.15s", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDim)} onMouseLeave={(e) => (e.currentTarget.style.background = C.bgCard)}>◄ Hide</button>
          )}
        </div>
      </div>

      {/* PROMINENT tabs — at the top (content-width, not full-span) */}
      <div style={{ display: "flex", gap: 8, padding: "12px 14px 12px", background: C.bgCard, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0 }}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                fontSize: 12.5, fontWeight: 700, letterSpacing: "0.01em", whiteSpace: "nowrap",
                border: `1.5px solid ${active ? C.borderAcc : C.borderSubtle}`,
                background: active ? `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)` : C.bgEl,
                color: active ? "#fff" : C.textMuted,
                boxShadow: active ? `0 0 14px ${C.accentGlow}, ${C.insetHi}` : "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.color = C.accent; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted; } }}
            >
              {t.l}
              <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 10, background: active ? "rgba(255,255,255,0.22)" : C.bg, color: active ? "#fff" : C.textDim, fontFamily: C.mono, minWidth: 20, textAlign: "center" }}>{t.ct}</span>
            </button>
          );
        })}
      </div>

      {/* AI-Generated safety badge (NFR-06.1) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", background: `linear-gradient(180deg, ${C.bgCard} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0, boxShadow: C.insetHi }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: C.accentDim, border: `1px solid ${C.borderAcc}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.accent, letterSpacing: "0.01em" }}>AI</div>
        <span style={{ fontSize: 10, color: C.text, fontWeight: 600, letterSpacing: "0.01em" }}>AI-Generated <span style={{ color: C.textMuted, fontWeight: 500 }}>— Clinician Review Required</span></span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>Glass v5.5</span>
      </div>

      <div style={{ flex: 1, overflow: "hidden", zoom: getZoom("insights") }}>
        {tab === "ddx" && <DdxView />}
        {tab === "tx" && <TreatmentView />}
      </div>
    </div>
  );
}
