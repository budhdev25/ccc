import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useSession } from "../../hooks/useSession";
import { ConsultProvider } from "../../context/ConsultContext";
import { useConsult } from "../../hooks/useConsult";
import { ConsultPanel } from "./ConsultPanel";
import { InsightsPanel } from "../Insights/InsightsPanel";
import { ResizeHandle } from "../primitives/ResizeHandle";
import { beginHorizontalResize } from "../../hooks/useResizeDrag";
import { useViewport } from "../../hooks/useViewport";

const MIN_CONSULT = 320;
const MIN_INSIGHTS = 360;

function WorkspaceInner() {
  const { C } = useTheme();
  const { insightsVisible, glassLoading, triggerInsights } = useConsult();
  const { consultWidth, setConsultWidth } = useSession();
  const { isMobile } = useViewport();
  const [mobilePane, setMobilePane] = useState<"consult" | "insights">("consult");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  // Measure the container so the chosen Consult width is clamped against the live
  // available space — Insights always keeps MIN_INSIGHTS, even on narrow viewports.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const effConsultWidth =
    containerW > 0
      ? Math.max(MIN_CONSULT, Math.min(consultWidth, containerW - MIN_INSIGHTS))
      : consultWidth;

  const startConsultDrag = (e: ReactMouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    beginHorizontalResize(e, { base: rect.left, min: MIN_CONSULT, max: rect.width - MIN_INSIGHTS, onWidth: setConsultWidth });
  };

  // Mobile: the two panels can't sit side by side, so show one at a time with a
  // segmented toggle. Consult is the landing pane; the user flips to Insights.
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 6, padding: "8px 10px", borderBottom: `1px solid ${C.borderSubtle}`, background: C.bgCard, flexShrink: 0 }}>
          {([["consult", "Consult"], ["insights", "Insights"]] as const).map(([id, label]) => {
            const active = mobilePane === id;
            return (
              <button key={id} onClick={() => setMobilePane(id)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `1.5px solid ${active ? C.borderAcc : C.borderSubtle}`, background: active ? C.accentDim : C.bgEl, color: active ? C.accent : C.textMuted, fontWeight: 700, fontSize: 12.5, fontFamily: "'Outfit',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: active ? `0 0 10px ${C.accentGlow}, ${C.insetHi}` : "none", transition: "all 0.15s" }}>
                {label}
                {id === "insights" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.accent : C.success, boxShadow: active ? `0 0 6px ${C.accentGlow}` : "none" }} />}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {mobilePane === "consult" ? <ConsultPanel /> : <InsightsPanel />}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, minWidth: 0 }}>
      {/* Consult column — fluid until Insights opens, then a resizable (clamped) width */}
      <div style={{ width: insightsVisible ? effConsultWidth : undefined, flexGrow: insightsVisible ? 0 : 1, flexShrink: insightsVisible ? 0 : 1, flexBasis: insightsVisible ? "auto" : 0, minWidth: 0, display: "flex", flexDirection: "column", borderRight: insightsVisible ? "none" : `1px solid ${C.border}` }}>
        <ConsultPanel />
      </div>

      {insightsVisible && <ResizeHandle onStart={startConsultDrag} ariaLabel="Resize Consult and Insights panels" />}
      {insightsVisible && <InsightsPanel />}

      {/* Collapsed Insights rail — click to open (also openable from the chat composer) */}
      {!insightsVisible && !glassLoading && (
        <div onClick={triggerInsights} title="Open Insights" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 54, flexShrink: 0, borderLeft: `1px solid ${C.borderAcc}`, background: `linear-gradient(180deg, ${C.accentDim} 0%, ${C.accentDimHi} 100%)`, cursor: "pointer", gap: 12, padding: "14px 0", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(180deg, ${C.accentDimHi} 0%, ${C.accentDimHi} 100%)`)} onMouseLeave={(e) => (e.currentTarget.style.background = `linear-gradient(180deg, ${C.accentDim} 0%, ${C.accentDimHi} 100%)`)}>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em", transform: "rotate(90deg)", whiteSpace: "nowrap" }}>Insights</span>
          <span style={{ fontSize: 14, color: C.accent }}>▸</span>
        </div>
      )}
    </div>
  );
}

export function ClinicalWorkspace() {
  return (
    <ConsultProvider>
      <WorkspaceInner />
    </ConsultProvider>
  );
}
