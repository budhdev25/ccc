import type { Theme } from "../../theme";

// Guideline-adherence mini bar chart rendered inline in chat. Ported from the preview.
export function ChartImg({ C }: { C: Theme }) {
  const bars = [
    { l: "GDMT", v: 95, c: C.accent },
    { l: "Diuresis", v: 88, c: C.blue },
    { l: "Prevent", v: 92, c: C.purple },
  ];
  return (
    <div style={{ background: C.bgEl, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", marginTop: 6, maxWidth: 220 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        Guideline adherence
      </div>
      {bars.map((x) => (
        <div key={x.l} style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 9, color: C.textMuted }}>{x.l}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: x.c }}>{x.v}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, background: x.c, width: `${x.v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
