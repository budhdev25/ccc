import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";
import { NotifyMenu, BellToggle } from "../primitives/NotifyMenu";
import { loadPref, savePref } from "../../lib/persist";

const MED_NOTIFY = [
  { key: "publications", label: "New publications", desc: "When a KOL you follow publishes" },
  { key: "trials", label: "Practice-changing trials", desc: "Major trial readouts in your field" },
  { key: "guidelines", label: "Guideline updates", desc: "When societies revise guidance" },
  { key: "kols", label: "Followed-KOL activity", desc: "Talks, posts & late-breakers from experts you follow" },
];

// Visual-only module (BUILD_PLAN OD-8). A background agent keeps medical
// intelligence current; the doctor can also prompt for specific intel, which is
// RANKED by keyword relevance. Phase 2+ (TODO): wire the live background feed.

interface Intel { n: string; r: string; recent: string; badge: string; kw: string[] }

const FEED: Intel[] = [
  { n: "Dr. James Chen", r: "National KOL · Cardiology", recent: "New NEJM publication on GDMT in HFrEF — 847 pts, 22% HF hospitalization reduction", badge: "National KOL", kw: ["hfref", "gdmt", "heart", "failure", "nejm", "trial"] },
  { n: "Dr. Rachel Park", r: "Rising KOL · Heart Failure", recent: "Presented at ACC 2026: novel biomarkers for early HFpEF detection", badge: "Rising KOL", kw: ["hfpef", "biomarker", "heart", "failure", "acc"] },
  { n: "Dr. Marcus Webb", r: "Guideline Contributor · AHA", recent: "Co-authored 2025 HF supplement on SGLT2i in advanced HF", badge: "Guideline", kw: ["sglt2", "guideline", "heart", "failure", "aha"] },
  { n: "Dr. Lena Ortiz", r: "Trialist · Cardiorenal", recent: "PI on EMPEROR-HF2 — interim readout shows benefit across the EF spectrum", badge: "Trialist", kw: ["trial", "emperor", "cardiorenal", "sglt2", "hfref"] },
  { n: "Dr. Aaron Vance", r: "KOL · Electrophysiology", recent: "Late-breaking AFib ablation vs drug-therapy outcomes at HRS 2026", badge: "National KOL", kw: ["afib", "ablation", "electrophysiology", "hrs", "rhythm"] },
  { n: "Dr. Priya Nair", r: "Imaging Lead · Echo", recent: "Strain echo predicts cardiotoxicity earlier than EF drop — JACC Imaging", badge: "Guideline", kw: ["echo", "imaging", "strain", "cardiotoxicity", "oncology"] },
  { n: "Dr. Tomás Rivera", r: "KOL · Interventional", recent: "Complete revascularization superior in STEMI — 2026 meta-analysis", badge: "National KOL", kw: ["stemi", "pci", "revascularization", "acs", "mi"] },
  { n: "Dr. Hannah Cole", r: "Rising KOL · Lipidology", recent: "PCSK9 + statin combo cuts MACE 18% in secondary prevention", badge: "Rising KOL", kw: ["lipid", "pcsk9", "statin", "prevention", "mace"] },
];

const CHIPS = ["Latest HFrEF trials", "AFib ablation", "Imaging & cardiotoxicity", "Lipid lowering"];

const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);

function rank(query: string): Intel[] {
  const tokens = tokenize(query);
  const scored = FEED.map((it) => {
    const hay = (it.n + " " + it.r + " " + it.recent + " " + it.kw.join(" ")).toLowerCase();
    const score = tokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    return { it, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits.map((s) => s.it) : FEED).slice(0, 6);
}

export function Medsights() {
  const { C } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Intel[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Followed KOLs (persisted by name) — get notified when they publish/present.
  const [following, setFollowing] = useState<Record<string, boolean>>(() => loadPref("ccc:med:following", {}));
  useEffect(() => savePref("ccc:med:following", following), [following]);
  const toggleFollow = (n: string) => setFollowing((f) => ({ ...f, [n]: !f[n] }));

  const run = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setStatus("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setResults(rank(text));
      setStatus("done");
    }, 1400);
  };

  const list = status === "done" ? results : FEED.slice(0, 4);

  return (
    <ContentPanel zoomKey="medsights">
      {/* Background-agent status */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.success, boxShadow: `0 0 6px ${C.success}90` }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>Medical Intelligence</span>
        <span style={{ fontSize: 9, color: C.textDim }}>Background agent · synced 4 min ago</span>
        <span style={{ marginLeft: "auto" }}>
          <NotifyMenu storeKey="ccc:notify:medsights" title="Medsights notifications" options={MED_NOTIFY} />
        </span>
      </div>

      {/* Intel agent prompt */}
      <div style={{ marginBottom: 14, padding: "14px", borderRadius: 12, background: C.bgEl, border: `1px solid ${C.borderSubtle}`, boxShadow: C.insetHi }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") run(prompt); }} placeholder="Ask for specific intel — trials, KOLs, guideline changes…" style={{ flex: 1, padding: "11px 14px", borderRadius: 9, background: C.bg, border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => (e.target.style.borderColor = C.borderAcc)} onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)} />
          <button onClick={() => run(prompt)} style={{ padding: "11px 18px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 12px ${C.accentGlow}, ${C.insetHi}`, whiteSpace: "nowrap" }}>Fetch ✦</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {CHIPS.map((c) => (
            <button key={c} onClick={() => { setPrompt(c); run(c); }} style={{ padding: "4px 11px", borderRadius: 14, fontSize: 10, fontWeight: 600, border: `1px solid ${C.borderSubtle}`, background: C.bg, color: C.textMuted, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.color = C.accent; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted; }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
        {status === "loading"
          ? "Agent refreshing intelligence…"
          : status === "done"
            ? `${results.length} results for “${query}” · just now`
            : "Current intelligence — Cardiology (auto-synced)"}
      </div>

      {status === "loading" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "26px 16px", color: C.accent, fontSize: 12, fontWeight: 600, animation: "pulse 1s ease-in-out infinite" }}>
          <span>◌</span> Pulling the latest from journals, trials & KOL feeds…
        </div>
      ) : (
        list.map((k, i) => (
          <Glow key={i} C={C} style={{ padding: "12px 14px", marginBottom: 10, background: C.bgEl, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: C.accentDim, border: `2px solid ${C.borderAcc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{k.n.split(" ").slice(1).map((w) => w[0]).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{k.n}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>{k.r}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: C.accentDim, color: C.accent, border: `1px solid ${C.borderAcc}30`, flexShrink: 0 }}>{k.badge}</span>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.55, paddingLeft: 44 }}>{k.recent}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, paddingLeft: 44 }}>
              {["Save", "Summarize", "Ask AI"].map((a) => (
                <button key={a} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 9, fontWeight: 600, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{a}</button>
              ))}
              <span style={{ marginLeft: "auto" }}>
                <BellToggle on={!!following[k.n]} onClick={() => toggleFollow(k.n)} label="Follow" />
              </span>
            </div>
          </Glow>
        ))
      )}
    </ContentPanel>
  );
}
