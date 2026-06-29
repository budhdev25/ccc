import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";

// Visual-only module (BUILD_PLAN OD-8). Demonstrable Patient / Personal / Both view.

type SchedType = "patient" | "personal";
interface SchedItem { t: string; title: string; sub: string; loc: string; type: SchedType }

const PATIENT: SchedItem[] = [
  { t: "8:00 AM", title: "Robert M.", sub: "Follow-up — HF", loc: "Room 4", type: "patient" },
  { t: "9:30 AM", title: "Sandra L.", sub: "DM Management", loc: "Telehealth", type: "patient" },
  { t: "11:00 AM", title: "New Patient", sub: "Consult — Chest Pain", loc: "Room 2", type: "patient" },
  { t: "1:30 PM", title: "David P.", sub: "Afib / CKD review", loc: "Room 4", type: "patient" },
  { t: "2:00 PM", title: "Maria T.", sub: "Oncology Review", loc: "Room 6", type: "patient" },
  { t: "4:00 PM", title: "Angela B.", sub: "COPD follow-up", loc: "Telehealth", type: "patient" },
];

const PERSONAL: SchedItem[] = [
  { t: "7:00 AM", title: "Morning run", sub: "Personal time", loc: "—", type: "personal" },
  { t: "10:30 AM", title: "Coffee — Dr. Ellis", sub: "Cath lab coordination", loc: "Cafeteria", type: "personal" },
  { t: "12:30 PM", title: "Lunch block", sub: "Personal time", loc: "—", type: "personal" },
  { t: "3:30 PM", title: "Admin / charting", sub: "Focus block", loc: "Office", type: "personal" },
  { t: "5:00 PM", title: "Kids pickup", sub: "Personal time", loc: "—", type: "personal" },
  { t: "6:30 PM", title: "Dept. M&M meeting", sub: "Cardiology", loc: "Conf Rm B", type: "personal" },
];

const toMin = (t: string) => {
  const [hm, ap] = t.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

export function Schedule() {
  const { C } = useTheme();
  const [mode, setMode] = useState<"patient" | "personal" | "both">("patient");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const items =
    mode === "patient" ? PATIENT
      : mode === "personal" ? PERSONAL
        : [...PATIENT, ...PERSONAL].sort((a, b) => toMin(a.t) - toMin(b.t));

  const noun = mode === "patient" ? "appointments" : mode === "personal" ? "personal events" : "items";
  const segs: { id: typeof mode; l: string }[] = [
    { id: "patient", l: "Patient" },
    { id: "personal", l: "Personal" },
    { id: "both", l: "Both" },
  ];

  return (
    <ContentPanel zoomKey="schedule">
      {/* Patient / Personal / Both toggle */}
      <div style={{ display: "flex", gap: 6, padding: 4, marginBottom: 16, background: C.bgEl, border: `1px solid ${C.borderSubtle}`, borderRadius: 10 }}>
        {segs.map((s) => {
          const active = mode === s.id;
          return (
            <button key={s.id} onClick={() => setMode(s.id)} style={{ flex: 1, padding: "9px 8px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.01em", background: active ? `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)` : "transparent", color: active ? "#fff" : C.textMuted, boxShadow: active ? `0 0 10px ${C.accentGlow}, ${C.insetHi}` : "none", transition: "all 0.15s" }}>{s.l}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {days.map((d, i) => (
          <Glow key={d} C={C} style={{ flex: 1, padding: "10px 6px", background: i === 2 ? C.accentDim : C.bgEl, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: i === 2 ? C.accent : C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{d}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: i === 2 ? C.accent : C.text }}>{12 + i}</div>
            {i === 2 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, margin: "4px auto 0" }} />}
          </Glow>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Wed May 14 · {items.length} {noun}</span>
        {mode === "both" && (
          <div style={{ display: "flex", gap: 10 }}>
            {([["Patient", C.accent], ["Personal", C.purple]] as [string, string][]).map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 600, color: C.textMuted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </span>
            ))}
          </div>
        )}
      </div>

      {items.map((a, i) => {
        const accent = a.type === "patient" ? C.accent : C.purple;
        return (
          <Glow key={i} C={C} leftAccent={accent} style={{ display: "flex", gap: 14, padding: "12px 14px", marginBottom: 8, background: C.bgEl, cursor: "pointer" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: accent, minWidth: 62 }}>{a.t}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{a.sub}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent, background: a.type === "patient" ? C.accentDim : `${C.purple}1f`, border: `1px solid ${accent}55`, borderRadius: 4, padding: "1px 6px" }}>{a.type}</span>
              <span style={{ fontSize: 10, color: C.textDim }}>{a.loc}</span>
            </div>
          </Glow>
        );
      })}
    </ContentPanel>
  );
}
