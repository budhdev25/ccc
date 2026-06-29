import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";

// Visual-only module (BUILD_PLAN OD-6/OD-8). Glass Scribe wiring is post-v1.
export function ScribeOutput() {
  const { C } = useTheme();
  const notes = [
    { p: "Robert M.", d: "Today 9:14 AM", ty: "Follow-Up", snip: "S: Worsening DOE. 3-pillow orthopnea. Bilateral LE edema worse…" },
    { p: "Sandra L.", d: "Yesterday 2:30 PM", ty: "DM Mgmt", snip: "S: 58F T2DM, quarterly f/u. Polyuria x 2 weeks, fatigue…" },
    { p: "James C.", d: "May 11", ty: "Urgent", snip: "S: 44M acute chest pain radiating to left arm, diaphoretic…" },
    { p: "Maria T.", d: "May 10", ty: "Onc", snip: "S: 67F metastatic TNBC, new bone pain. On Pembrolizumab…" },
  ];
  return (
    <ContentPanel zoomKey="scribe">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Notes</span>
        <button style={{ padding: "4px 12px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: `2px solid ${C.borderAcc}`, background: C.accentDim, color: C.accent, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 6px ${C.accentGlow}` }}>+ New Note</button>
      </div>
      {notes.map((n, i) => (
        <Glow key={i} C={C} style={{ padding: "12px 14px", marginBottom: 8, background: C.bgEl, cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{n.p}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: C.bgCard, color: C.textMuted, border: `1px solid ${C.border}` }}>{n.ty}</span>
              <span style={{ fontSize: 9, color: C.textDim }}>{n.d}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.snip}</div>
        </Glow>
      ))}
    </ContentPanel>
  );
}
