import { useTheme } from "../../context/ThemeContext";
import { QA } from "../../lib/mockData";

export function ActionsTab() {
  const { C } = useTheme();
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
      <div style={{ maxWidth: 240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {QA.map((a, i) => (
            <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 8px", borderRadius: 7, border: `1px solid ${C.border}`, background: C.bgEl, cursor: "pointer", fontFamily: "'Outfit',sans-serif", textAlign: "center", transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.background = C.accentDim; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgEl; }}>
              <span style={{ fontSize: 18 }}>{a.i}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{a.l}</span>
              <span style={{ fontSize: 9, color: C.textDim }}>{a.d}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
