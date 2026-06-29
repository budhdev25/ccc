import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";

// Visual-only module (BUILD_PLAN OD-8).
export function RecentDocs() {
  const { C } = useTheme();
  const docs = [
    { n: "Echo Report — EF 30%", p: "Robert M.", d: "May 13", sz: "2.4 MB" },
    { n: "CBC + BMP Results", p: "Robert M.", d: "May 12", sz: "0.8 MB" },
    { n: "HbA1c — 9.2%", p: "Sandra L.", d: "May 13", sz: "0.5 MB" },
    { n: "12-Lead ECG", p: "James C.", d: "May 11", sz: "1.2 MB" },
    { n: "PET Scan Report", p: "Maria T.", d: "Apr 28", sz: "8.6 MB" },
    { n: "Oncology Note", p: "Maria T.", d: "May 10", sz: "0.3 MB" },
  ];
  return (
    <ContentPanel zoomKey="docs">
      <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "20px", textAlign: "center", marginBottom: 16, cursor: "pointer" }}>
        <div style={{ fontSize: 24, opacity: 0.3, marginBottom: 6 }}>📁</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Drop files or click to upload</div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>PDF, DOCX, JPG, DICOM</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {docs.map((d, i) => (
          <Glow key={i} C={C} style={{ padding: "10px 12px", background: C.bgEl, cursor: "pointer" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.n}</div>
            <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{d.p} · {d.d}</div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{d.sz}</div>
          </Glow>
        ))}
      </div>
    </ContentPanel>
  );
}
