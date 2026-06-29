import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSession } from "../../context/SessionContext";
import { useViewport } from "../../hooks/useViewport";
import { DdxView } from "../Insights/DdxView";
import { TreatmentView } from "../Insights/TreatmentView";
import { EchoImg } from "../primitives/EchoImg";
import { ChartImg } from "../primitives/ChartImg";
import { MSGS } from "../../lib/mockData";

type FsTab = "chat" | "ddx" | "tx";

// Right-hand context column for AVE full-screen presentation mode:
// a persistent patient-context header + switchable Chat / DDx / Treatment.
export function FullscreenContext() {
  const { C } = useTheme();
  const { loadedCtx } = useSession();
  const { isMobile } = useViewport();
  const [tab, setTab] = useState<FsTab>("ddx");

  const tabs: { id: FsTab; l: string; ct?: number }[] = [
    { id: "chat", l: "Chat" },
    { id: "ddx", l: "Differential Dx", ct: 5 },
    { id: "tx", l: "Treatment Plan", ct: 3 },
  ];

  const initials = loadedCtx?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2) || "PT";
  const vitals: [string, string][] = loadedCtx
    ? [["BP", loadedCtx.bp], ["HR", loadedCtx.hr], ["Temp", loadedCtx.temp], ["SpO₂", loadedCtx.spo2]]
    : [];
  const history: [string, string][] = loadedCtx
    ? [["CC", loadedCtx.cc], ["PMH", loadedCtx.pmh], ["Meds", loadedCtx.meds], ["Allergies", loadedCtx.alg]]
    : [];

  return (
    <div style={{ width: isMobile ? "100%" : 460, flexGrow: isMobile ? 1 : 0, flexShrink: isMobile ? 1 : 0, flexBasis: isMobile ? 0 : "auto", minHeight: 0, borderLeft: isMobile ? "none" : `1px solid ${C.border}`, borderTop: isMobile ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Persistent patient context */}
      <div style={{ flexShrink: 0, padding: "12px 14px", borderBottom: `1px solid ${C.borderSubtle}`, background: `linear-gradient(180deg, ${C.bgCard} 0%, ${C.bgEl} 100%)` }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>Patient context</div>
        {loadedCtx ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentHi} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: `${C.insetHi}, 0 2px 6px ${C.accentGlow}` }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loadedCtx.name || "Unknown Patient"}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{loadedCtx.age}yr · {loadedCtx.sex}{loadedCtx.mrn ? <span style={{ fontFamily: C.mono, color: C.textDim }}> · {loadedCtx.mrn}</span> : null}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5, marginBottom: 9 }}>
              {vitals.map(([l, v]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 4px", borderRadius: 5, background: C.bg, border: `1px solid ${C.borderSubtle}` }}>
                  <span style={{ fontSize: 8, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: C.mono, fontVariantNumeric: "tabular-nums" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 12px" }}>
              {history.map(([l, v]) => (
                <div key={l} style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</span>
                  <div style={{ fontSize: 10.5, color: C.textMuted, lineHeight: 1.45 }}>{v || "—"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 11, color: C.textMuted, padding: "6px 0" }}>Free consult — no patient loaded.</div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "12px 14px", background: C.bgCard, borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, border: `1.5px solid ${active ? C.borderAcc : C.borderSubtle}`, background: active ? `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)` : C.bgEl, color: active ? "#fff" : C.textMuted, boxShadow: active ? `0 0 14px ${C.accentGlow}, ${C.insetHi}` : "none", transition: "all 0.15s" }}>
              {t.l}
              {t.ct != null && <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: active ? "rgba(255,255,255,0.22)" : C.bg, color: active ? "#fff" : C.textDim, fontFamily: C.mono }}>{t.ct}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "ddx" && <DdxView />}
        {tab === "tx" && <TreatmentView />}
        {tab === "chat" && (
          <div style={{ height: "100%", overflowY: "auto", padding: "16px 18px" }}>
            {MSGS.map((m, i) => {
              const isDr = m.w === "dr";
              return (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 18, flexDirection: isDr ? "row-reverse" : "row" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDr ? `linear-gradient(135deg, ${C.accent} 0%, ${C.accentHi} 100%)` : C.bgEl, border: isDr ? "none" : `1px solid ${C.borderSubtle}`, fontSize: 8, fontWeight: 700, color: isDr ? "#fff" : C.textDim }}>{isDr ? "HCP" : "AI"}</div>
                  <div style={{ maxWidth: isDr ? "82%" : "100%", flex: isDr ? undefined : 1, minWidth: 0 }}>
                    {isDr ? (
                      <div style={{ padding: "10px 14px", borderRadius: 16, background: C.accentDim, border: `1px solid ${C.borderAcc}26` }}>
                        <span style={{ fontSize: 13.5, color: C.text, lineHeight: 1.6 }}>{m.t}</span>
                      </div>
                    ) : (
                      <div style={{ paddingTop: 2 }}><span style={{ fontSize: 13.5, color: C.text, lineHeight: 1.6 }}>{m.t}</span></div>
                    )}
                    {m.img === "echo" && <EchoImg C={C} />}
                    {m.img === "chart" && <ChartImg C={C} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
