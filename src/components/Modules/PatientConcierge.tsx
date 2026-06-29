import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";

// Visual-only module (BUILD_PLAN OD-8).
export function PatientConcierge() {
  const { C } = useTheme();
  const items = [
    { i: "🔔", t: "Clinical trial match", b: "NCT05234567 — EMPEROR-HF2 enrolling HFrEF. 3 patients may qualify.", time: "2h ago", c: C.warning },
    { i: "📊", t: "Prescribing pattern insight", b: "SGLT2i initiation rate 78% — 12% above regional average.", time: "Today", c: C.accent },
    { i: "📋", t: "Guideline update", b: "ACC/AHA addendum on GDMT sequencing. Affects 4 active patients.", time: "Yesterday", c: C.blue },
    { i: "👤", t: "Dr. Chen published new data", b: "NEJM article on GDMT titration — relevant to Robert M.'s case.", time: "3d ago", c: C.purple },
  ];
  return (
    <ContentPanel zoomKey="concierge">
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Patient concierge briefing — May 13, 2026</div>
      {items.map((x, i) => (
        <Glow key={i} C={C} leftAccent={x.c} style={{ padding: "12px 14px", marginBottom: 10, background: C.bgEl, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{x.i}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{x.t}</span>
                <span style={{ fontSize: 9, color: C.textDim, flexShrink: 0, marginLeft: 8 }}>{x.time}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.55 }}>{x.b}</div>
            </div>
          </div>
        </Glow>
      ))}
    </ContentPanel>
  );
}
