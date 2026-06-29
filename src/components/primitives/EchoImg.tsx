import type { Theme } from "../../theme";

// Stylized echo thumbnail rendered inline in chat. Ported from the preview.
export function EchoImg({ C }: { C: Theme }) {
  return (
    <div
      style={{
        background: "#0a0f1a", height: 100, borderRadius: 6, marginTop: 6, maxWidth: 220,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", border: `1px solid ${C.border}`,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%",
            border: `1px solid ${C.borderAcc}40`,
            width: 28 + i * 20, height: 18 + i * 14, opacity: 0.5 - i * 0.1,
          }}
        />
      ))}
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accentGlow}` }} />
      <div style={{ position: "absolute", bottom: 4, left: 6, fontSize: 8, color: C.accent, fontFamily: "monospace" }}>
        EF: 30% · LV dilation
      </div>
    </div>
  );
}
