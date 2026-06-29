import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";
import { TX } from "../../lib/mockData";

// TODO (Phase 3): replace TX mock with streamed Glass treatment plan + citations.
export function TreatmentView() {
  const { C } = useTheme();
  return (
    <ContentPanel fill="full" maxWidth={520}>
      <Glow C={C} leftAccent={C.accent} style={{ padding: "12px 14px", marginBottom: 12, background: `linear-gradient(135deg, ${C.bgEl} 0%, ${C.accentDim} 200%)`, boxShadow: `${C.shadowSoft}, ${C.insetHi}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>Impression</div>
        <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6, letterSpacing: "-0.005em" }}>{TX.imp}</div>
      </Glow>
      {TX.probs.map((p, i) => (
        <Glow key={i} C={C} style={{ padding: "11px 14px", marginBottom: 7, background: C.bgEl, boxShadow: C.shadowSoft }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 7, display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.005em" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, fontSize: 10, fontWeight: 700, color: C.accent, background: C.accentDim, border: `1px solid ${C.borderAcc}50`, borderRadius: 5, fontFamily: C.mono, boxShadow: C.insetHi }}>{i + 1}</span>
            {p.l}
          </div>
          {p.items.map((it, j) => (
            <div key={j} style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.75, paddingLeft: 12, display: "flex", gap: 6 }}>
              <span style={{ color: C.accent, flexShrink: 0 }}>›</span>
              <span>{it}</span>
            </div>
          ))}
        </Glow>
      ))}
      <Glow C={C} leftAccent={C.warning} style={{ padding: "11px 14px", background: C.bgEl, boxShadow: C.shadowSoft }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.warning, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>Follow-Up</div>
        {TX.fu.map((f, i) => (
          <div key={i} style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.75, paddingLeft: 12, display: "flex", gap: 6 }}>
            <span style={{ color: C.warning, flexShrink: 0 }}>→</span>
            <span>{f}</span>
          </div>
        ))}
      </Glow>
    </ContentPanel>
  );
}
