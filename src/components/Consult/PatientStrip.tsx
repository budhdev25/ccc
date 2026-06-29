import { useTheme } from "../../context/ThemeContext";
import { useSession } from "../../context/SessionContext";
import { useConsult } from "../../context/ConsultContext";

// Only renders when a patient context is loaded (BUILD_PLAN non-negotiable:
// the strip appears under the Consult label only if loadedCtx !== null).
export function PatientStrip() {
  const { C } = useTheme();
  const { loadedCtx } = useSession();
  const { patientExpanded, setPatientExpanded } = useConsult();
  if (!loadedCtx) return null;

  const vitals: [string, string][] = [
    ["BP", loadedCtx.bp], ["HR", loadedCtx.hr], ["Temp", loadedCtx.temp], ["SpO₂", loadedCtx.spo2],
  ];
  const initials = loadedCtx.name?.split(" ").map((w) => w[0]).join("").slice(0, 2) || "PT";

  return (
    <div onClick={() => setPatientExpanded((v) => !v)} style={{ flexShrink: 0, cursor: "pointer", background: `linear-gradient(180deg, ${C.bgCard} 0%, ${C.bgEl} 100%)`, borderBottom: `1px solid ${C.borderSubtle}`, boxShadow: C.insetHi }}>
      <div style={{ padding: "11px 14px 10px", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentHi} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: `${C.insetHi}, 0 2px 6px ${C.accentGlow}`, letterSpacing: "-0.02em" }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, lineHeight: 1.25, letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loadedCtx.name || "Unknown Patient"}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span>{loadedCtx.age}yr · {loadedCtx.sex}</span>
              {loadedCtx.mrn && (<><span style={{ color: C.borderSubtle }}>·</span><span style={{ fontFamily: C.mono, color: C.textDim, fontSize: 9.5, letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis" }}>{loadedCtx.mrn}</span></>)}
            </div>
          </div>
          <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 2, transition: "transform 0.2s", transform: patientExpanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▾</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5 }}>
          {vitals.map(([l, v]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 4px", borderRadius: 5, background: C.bg, border: `1px solid ${C.borderSubtle}`, boxShadow: C.insetHi }}>
              <span style={{ fontSize: 8.5, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 1 }}>{l}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: C.mono, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {patientExpanded && (
        <div style={{ padding: "4px 14px 14px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ maxWidth: 280, margin: "0 auto" }}>
            {([["PMH", loadedCtx.pmh], ["Medications", loadedCtx.meds], ["Allergies", loadedCtx.alg]] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{l}</div>
                <div style={{ padding: "7px 10px", borderRadius: 5, fontSize: 11, color: v ? C.text : C.textDim, background: C.bg, border: `1px solid ${C.borderSubtle}`, lineHeight: 1.5, wordBreak: "break-word" }}>{v || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
