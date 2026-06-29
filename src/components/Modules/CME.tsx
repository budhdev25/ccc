import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";
import { NotifyMenu, BellToggle } from "../primitives/NotifyMenu";
import { loadPref, savePref } from "../../lib/persist";

const CME_NOTIFY = [
  { key: "deadlines", label: "Registration deadlines", desc: "Before a program you're tracking closes" },
  { key: "new", label: "New accredited programs", desc: "When new CME/CE matches your specialty" },
  { key: "cycle", label: "Credit cycle reminders", desc: "When your CME / MOC cycle is coming due" },
  { key: "ethics", label: "Ethics requirement", desc: "Annual ethics-credit reminders" },
];

// Visual-only module (BUILD_PLAN OD-8). The doctor prompts a CME agent which
// "fetches" and RANKS accredited programs by keyword relevance to the prompt.
// Phase 2+ (TODO): replace the simulated fetch with a real agent querying
// ACCME/provider catalogs.

interface Program { t: string; prov: string; url: string; desc: string; cr: number; type: string; fmt: string; due: string; kw: string[] }

// Fictitious CME/CE catalog. Providers are real accrediting bodies (public sites);
// the specific programs are demo content.
const CATALOG: Program[] = [
  { t: "HF Management 2025: GDMT Sequencing & Titration", prov: "ACC Learning", url: "acc.org/education", desc: "Case-based modules on initiating and up-titrating the four pillars of GDMT in HFrEF, aligned to the 2022/2025 ACC/AHA heart failure guidelines.", cr: 2.0, type: "AMA PRA Category 1", fmt: "Online", due: "Jun 30", kw: ["heart", "failure", "hfref", "gdmt", "guideline", "titration", "sacubitril", "ejection"] },
  { t: "Advanced Echocardiography Interpretation", prov: "American Society of Echocardiography", url: "asecho.org/education", desc: "Expert read-alongs of complex TTE/TEE cases covering strain, diastology, and valvular quantification with hands-on measurement practice.", cr: 4.0, type: "AMA PRA Category 1", fmt: "Live Webinar", due: "Jul 15", kw: ["echo", "echocardiography", "imaging", "ef", "valvular", "ultrasound"] },
  { t: "SGLT2 Inhibitors Across the Cardiorenal Spectrum", prov: "American Heart Association", url: "heart.org/professional", desc: "Evidence review of SGLT2 inhibitors across HFrEF, HFpEF, CKD, and type 2 diabetes, with prescribing pearls and contraindication management.", cr: 3.0, type: "AMA PRA Category 1", fmt: "Self-Study", due: "Aug 1", kw: ["sglt2", "dapagliflozin", "diabetes", "cardiorenal", "ckd", "heart", "failure"] },
  { t: "Cardiac Amyloidosis: Recognition to Treatment", prov: "Mayo Clinic CME", url: "ce.mayo.edu", desc: "When to suspect ATTR/AL amyloidosis, the modern non-biopsy diagnostic pathway, and treatment decisions in the tafamidis era.", cr: 2.0, type: "AMA PRA Category 1", fmt: "Online", due: "Aug 12", kw: ["amyloidosis", "infiltrative", "tafamidis", "restrictive", "heart"] },
  { t: "Atrial Fibrillation: Rhythm, Rate & Anticoagulation", prov: "Cleveland Clinic", url: "my.clevelandclinic.org/cme", desc: "A pragmatic framework for rate vs. rhythm control, DOAC selection, and stroke-risk stratification in atrial fibrillation.", cr: 3.0, type: "AMA PRA Category 1", fmt: "Online", due: "Aug 20", kw: ["afib", "atrial", "fibrillation", "anticoagulation", "apixaban", "stroke", "rhythm"] },
  { t: "Acute Coronary Syndromes: 2025 Guideline Update", prov: "American College of Cardiology", url: "acc.org/education", desc: "What changed in the 2025 ACS guideline — troponin pathways, antiplatelet duration, and the case for complete revascularization.", cr: 2.0, type: "AMA PRA Category 1", fmt: "Live Webinar", due: "Sep 2", kw: ["acs", "mi", "myocardial", "infarction", "troponin", "pci", "chest", "pain", "ischemic"] },
  { t: "Ethics in AI-Assisted Clinical Decision Support", prov: "American Medical Association", url: "edhub.ama-assn.org", desc: "Bias, transparency, informed consent, and accountability when integrating AI decision-support tools into the clinical workflow.", cr: 1.0, type: "AMA PRA Category 1 · Ethics", fmt: "Online", due: "Sep 5", kw: ["ethics", "ai", "decision", "support", "bias", "consent"] },
  { t: "Cardio-Oncology: Managing Cardiotoxicity", prov: "MD Anderson CME", url: "mdanderson.org/education-training", desc: "Baseline risk assessment, surveillance imaging, and cardioprotective strategies for anthracycline- and HER2-directed therapies.", cr: 3.0, type: "AMA PRA Category 1", fmt: "Self-Study", due: "Sep 18", kw: ["oncology", "cardiotoxicity", "chemotherapy", "anthracycline", "cancer"] },
  { t: "Pulmonary Hypertension Board Review", prov: "CHEST", url: "chestnet.org/education", desc: "High-yield review of PH classification, right-heart hemodynamics, and group-specific therapy for boards and everyday practice.", cr: 4.0, type: "AMA PRA Category 1 · MOC", fmt: "Online", due: "Oct 1", kw: ["pulmonary", "hypertension", "board", "review", "right", "heart"] },
  { t: "Lipid Management & PCSK9 Inhibitors", prov: "National Lipid Association", url: "lipid.org", desc: "Updated LDL targets, when to escalate to PCSK9 inhibitors or inclisiran, and intensifying secondary prevention.", cr: 2.0, type: "AMA PRA Category 1", fmt: "Online", due: "Oct 10", kw: ["lipid", "cholesterol", "statin", "pcsk9", "prevention"] },
  { t: "Device Therapy: ICD & CRT Selection", prov: "Heart Rhythm Society", url: "hrsonline.org/education", desc: "Indications and patient selection for ICD and CRT, EF thresholds, and shared decision-making for primary prevention.", cr: 3.0, type: "AMA PRA Category 1", fmt: "Live Webinar", due: "Oct 22", kw: ["icd", "crt", "device", "ep", "sudden", "death", "ejection", "fraction"] },
  { t: "Cardiology Boards: High-Yield Review Intensive", prov: "MedStudy", url: "medstudy.com", desc: "Comprehensive ABIM cardiology recertification review with question banks, landmark trials, and high-yield summaries.", cr: 6.0, type: "AMA PRA Category 1 · MOC", fmt: "Self-Study", due: "Nov 5", kw: ["board", "boards", "review", "exam", "recertification", "abim", "prep"] },
];

const CHIPS = ["Heart failure GDMT", "Echo interpretation", "Atrial fibrillation", "Board prep"];

const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);

function rank(query: string): { items: Program[]; matched: boolean } {
  const tokens = tokenize(query);
  const scored = CATALOG.map((p) => {
    const hay = (p.t + " " + p.prov + " " + p.fmt + " " + p.kw.join(" ")).toLowerCase();
    const score = tokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    return { p, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  // If nothing matched, fall back to the catalog so the agent always returns something.
  return { items: (hits.length ? hits.map((s) => s.p) : CATALOG).slice(0, 6), matched: hits.length > 0 };
}

export function CME() {
  const { C } = useTheme();
  const cr = [
    { cat: "CME", e: 18, tot: 25, c: C.accent },
    { cat: "MOC", e: 8, tot: 15, c: C.blue },
    { cat: "Ethics", e: 2, tot: 3, c: C.purple },
  ];
  const [prompt, setPrompt] = useState("");
  // Show recommended programs by default so the details are visible on open;
  // prompting re-ranks them.
  const [status, setStatus] = useState<"loading" | "done">("done");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Program[]>(() => CATALOG.slice(0, 5));
  const [matched, setMatched] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Per-program reminders ("remind me before this closes"), persisted by title.
  const [reminders, setReminders] = useState<Record<string, boolean>>(() => loadPref("ccc:cme:reminders", {}));
  useEffect(() => savePref("ccc:cme:reminders", reminders), [reminders]);
  const toggleReminder = (t: string) => setReminders((r) => ({ ...r, [t]: !r[t] }));

  const run = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setStatus("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const { items, matched: m } = rank(text);
      setResults(items);
      setMatched(m);
      setStatus("done");
    }, 1400);
  };

  return (
    <ContentPanel zoomKey="cme">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Credits</span>
        <NotifyMenu storeKey="ccc:notify:cme" title="CME / CE notifications" options={CME_NOTIFY} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 18 }}>
        {cr.map((c) => (
          <Glow key={c.cat} C={C} style={{ padding: "12px 14px", background: C.bgEl, textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{c.cat}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.c, marginBottom: 4 }}>{c.e}<span style={{ fontSize: 12, color: C.textDim }}>/{c.tot}</span></div>
            <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden", marginTop: 6 }}>
              <div style={{ height: "100%", borderRadius: 2, background: c.c, width: `${(c.e / c.tot) * 100}%` }} />
            </div>
          </Glow>
        ))}
      </div>

      {/* CME agent prompt */}
      <div style={{ marginBottom: 14, padding: "14px", borderRadius: 12, background: C.bgEl, border: `1px solid ${C.borderSubtle}`, boxShadow: C.insetHi }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
          <span style={{ fontSize: 14 }}>🎓</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>CME / CE agent</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: C.textDim }}>{CATALOG.length} ACCME-accredited sources</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") run(prompt); }} placeholder="Describe the programs you want — topic, credits, format…" style={{ flex: 1, padding: "11px 14px", borderRadius: 9, background: C.bg, border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => (e.target.style.borderColor = C.borderAcc)} onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)} />
          <button onClick={() => run(prompt)} style={{ padding: "11px 18px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 12px ${C.accentGlow}, ${C.insetHi}`, whiteSpace: "nowrap" }}>Fetch ✦</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {CHIPS.map((c) => (
            <button key={c} onClick={() => { setPrompt(c); run(c); }} style={{ padding: "4px 11px", borderRadius: 14, fontSize: 10, fontWeight: 600, border: `1px solid ${C.borderSubtle}`, background: C.bg, color: C.textMuted, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.color = C.accent; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted; }}>{c}</button>
          ))}
        </div>
      </div>

      {status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "26px 16px", color: C.accent, fontSize: 12, fontWeight: 600, animation: "pulse 1s ease-in-out infinite" }}>
          <span>◌</span> CME agent searching accredited providers…
        </div>
      )}

      {status === "done" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{results.length} programs · {query ? (matched ? "ranked by relevance" : "closest available") : "recommended for you"}</span>
            {query && <span style={{ fontSize: 10, color: C.accent, fontWeight: 600, maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>“{query}”</span>}
          </div>
          {results.map((r, i) => (
            <Glow key={i} C={C} style={{ padding: "13px 15px", marginBottom: 9, background: C.bgEl }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{r.t}</div>
                {/* Credits earned */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", background: C.accentDim, border: `1px solid ${C.borderAcc}55`, borderRadius: 8, padding: "4px 10px", minWidth: 54 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{r.cr.toFixed(r.cr % 1 ? 1 : 0)}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>credits</span>
                </div>
              </div>
              {/* Provider + website */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2px 8px", marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{r.prov}</span>
                <a href={`https://${r.url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 10.5, color: C.accent, fontWeight: 600, textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>{r.url} ↗</a>
              </div>
              {/* Description */}
              <div style={{ fontSize: 11.5, color: C.textMuted, lineHeight: 1.55, marginBottom: 8 }}>{r.desc}</div>
              {/* Meta */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 8px", fontSize: 10, color: C.textDim }}>
                <span style={{ fontWeight: 700, color: C.textMuted }}>{r.type}</span>
                <span style={{ color: C.borderSubtle }}>·</span>
                <span>{r.fmt}</span>
                <span style={{ color: C.borderSubtle }}>·</span>
                <span style={{ color: C.warning, fontWeight: 600 }}>Register by {r.due}</span>
                <span style={{ marginLeft: "auto" }}>
                  <BellToggle on={!!reminders[r.t]} onClick={() => toggleReminder(r.t)} label="Remind me" />
                </span>
              </div>
            </Glow>
          ))}
        </>
      )}
    </ContentPanel>
  );
}
