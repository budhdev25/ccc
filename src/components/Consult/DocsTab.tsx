import { useTheme } from "../../hooks/useTheme";
import { useConsult } from "../../hooks/useConsult";
import { consultService } from "../../services";

export function DocsTab() {
  const { C } = useTheme();
  const { docOn, toggleDoc } = useConsult();
  const documents = consultService.getDocuments();
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
      <div style={{ maxWidth: 220, margin: "0 auto" }}>
        <div style={{ border: `1px dashed ${C.border}`, borderRadius: 6, padding: "8px 12px", textAlign: "center", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>📁</span>
          <span style={{ fontSize: 10, color: C.textDim }}>Upload document</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Uploaded ({documents.length})</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: C.textMuted }}>Send to Glass</span>
        </div>
        {documents.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4, borderRadius: 5, background: C.bgEl, border: `1px solid ${docOn[i] ? C.borderAcc + "40" : C.border}` }}>
            <span style={{ fontSize: 10, opacity: 0.5, flexShrink: 0 }}>📄</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.n}</div>
              <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{d.d}</div>
            </div>
            <button onClick={() => toggleDoc(i)} title={docOn[i] ? "Remove from Glass context" : "Add to Glass context"} style={{ width: 26, height: 14, borderRadius: 7, border: "none", cursor: "pointer", background: docOn[i] ? C.accent : C.border, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: docOn[i] ? 12 : 2, width: 10, height: 10, borderRadius: "50%", background: "white", transition: "left 0.18s" }} />
            </button>
          </div>
        ))}
        <div style={{ fontSize: 9, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>Toggled-on documents are included as context in every Glass query</div>
      </div>
    </div>
  );
}
