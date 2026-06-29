import { useTheme } from "../../hooks/useTheme";
import { useSession } from "../../hooks/useSession";
import { useConsult } from "../../hooks/useConsult";
import { PatientStrip } from "./PatientStrip";
import { ChatTab } from "./ChatTab";
import { DocsTab } from "./DocsTab";
import { ActionsTab } from "./ActionsTab";
import { ZoomControl } from "../primitives/ZoomControl";
import type { CtrlTab } from "../../lib/types";
import type { ReactNode } from "react";

// Each Consult sub-tab (Chat / Docs / Actions) gets its own zoom control so a
// user can size up just the tab they're working in. It composes on top of the
// panel-level "consult" zoom in the header.
function SubTab({ zoomKey, children }: { zoomKey: string; children: ReactNode }) {
  const { C } = useTheme();
  const { getZoom } = useSession();
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "3px 10px", borderBottom: `1px solid ${C.borderSubtle}66`, background: C.bgCard }}>
        <ZoomControl zoomKey={zoomKey} />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", zoom: getZoom(zoomKey) }}>
        {children}
      </div>
    </div>
  );
}

export function ConsultPanel() {
  const { C } = useTheme();
  const { ctrlTab, setCtrlTab, chatHidden, setChatHidden, glassLoading } = useConsult();
  const { getZoom } = useSession();

  return (
    <>
      {/* Consult header */}
      <div style={{ padding: "6px 14px", background: `linear-gradient(90deg, ${C.accentDim} 0%, ${C.accentDim}80 60%, transparent 100%)`, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accentGlow}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.14em" }}>Consult</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {glassLoading && (
            <span style={{ fontSize: 9, color: C.accent, display: "flex", alignItems: "center", gap: 4, animation: "pulse 1s ease-in-out infinite", fontWeight: 500, whiteSpace: "nowrap" }}>⟳ Glass…</span>
          )}
          <ZoomControl zoomKey="consult" label="Consult" />
        </div>
      </div>

      {/* Zoomable consult content (CSS zoom scales text + spacing and reflows) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zoom: getZoom("consult") }}>
      <PatientStrip />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Tabs: Chat | Docs | Actions */}
        <div style={{ display: "flex", background: C.bgCard, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0, padding: "6px 8px", gap: 4 }}>
          {/* Chat — split pill */}
          <div style={{ flex: 1, display: "flex", border: `1px solid ${ctrlTab === "chat" ? C.borderAcc : C.borderSubtle}`, borderRadius: 6, overflow: "hidden", boxShadow: ctrlTab === "chat" ? `0 0 8px ${C.accentGlow}, ${C.insetHi}` : "none", transition: "all 0.15s", background: ctrlTab === "chat" ? C.accentDim : C.bgEl }}>
            <button onClick={() => setCtrlTab("chat")} style={{ flex: 1, padding: "7px 4px", fontSize: 10.5, fontWeight: ctrlTab === "chat" ? 700 : 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", border: "none", borderRight: `1px solid ${ctrlTab === "chat" ? C.borderAcc + "60" : C.borderSubtle}`, background: "transparent", color: ctrlTab === "chat" ? C.accent : C.textMuted, transition: "all 0.15s", letterSpacing: "0.02em" }}>Chat</button>
            <button onClick={() => setChatHidden((v) => !v)} title={chatHidden ? "Show transcript" : "Suppress transcript"} style={{ padding: "7px 10px", fontSize: 11, fontFamily: "'Outfit',sans-serif", cursor: "pointer", border: "none", background: "transparent", color: chatHidden ? C.accent : C.textDim, transition: "all 0.15s" }}>{chatHidden ? "👁" : "🚫"}</button>
          </div>
          {(["docs", "actions"] as CtrlTab[]).map((t) => {
            const active = ctrlTab === t;
            return (
              <button key={t} onClick={() => setCtrlTab(t)} style={{ flex: 1, padding: "7px 4px", fontSize: 10.5, fontWeight: active ? 700 : 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", border: `1px solid ${active ? C.borderAcc : C.borderSubtle}`, borderRadius: 6, background: active ? C.accentDim : C.bgEl, color: active ? C.accent : C.textMuted, transition: "all 0.15s", boxShadow: active ? `0 0 8px ${C.accentGlow}, ${C.insetHi}` : "none", letterSpacing: "0.02em", textTransform: "capitalize" }}>{t}</button>
            );
          })}
        </div>

        {ctrlTab === "chat" && (
          <SubTab zoomKey="consult.chat"><ChatTab /></SubTab>
        )}
        {ctrlTab === "docs" && (
          <SubTab zoomKey="consult.docs"><DocsTab /></SubTab>
        )}
        {ctrlTab === "actions" && (
          <SubTab zoomKey="consult.actions"><ActionsTab /></SubTab>
        )}
      </div>
      </div>
    </>
  );
}
