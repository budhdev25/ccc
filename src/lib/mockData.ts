// Mock data — ported verbatim from CCC_Preview.jsx.
// Powers Phases 1–5 PHI-free by construction; stays as fallback fixtures.
// UI code must consume data via src/services/* — do not import this file from components.
// TODO (Phase 2/3): DDX/TX/MSGS replaced by real Tavus utterances + Glass responses.
// TODO (Phase 4): EHR_PTS replaced by SMART on FHIR (when an EHR partner exists).

import type {
  NavItem,
  Patient,
  EhrPatient,
  Ddx,
  TxPlan,
  ChatMsg,
  QuickAction,
  DocStub,
} from "./types";

export const NAV: NavItem[] = [
  { id: "clinical", icon: "🩺", label: "Clinical Assistant" },
  { id: "schedule", icon: "📅", label: "Schedule" },
  { id: "cme", icon: "🎓", label: "CME / CE" },
  { id: "medsights", icon: "📰", label: "Medsights" },
  { id: "concierge", icon: "💡", label: "Patient Concierge Insights" },
  { id: "scribe", icon: "✍️", label: "Scribe Output" },
  { id: "docs", icon: "📁", label: "Recent Docs" },
];

export const PTS: Patient[] = [
  { id: 1, ini: "RM", name: "Robert M.", date: "Today", sum: "HFrEF, EF 30%", ctx: { age: 71, sex: "Male", cc: "Progressive dyspnea, bilateral LE edema", pmh: "MI (2019), HTN, HLD, HFrEF", meds: "Aspirin 81mg, Metoprolol 25mg", alg: "NKDA", bp: "142/88", hr: "88", temp: "98.4°F", spo2: "94%" } },
  { id: 2, ini: "SL", name: "Sandra L.", date: "Yesterday", sum: "T2DM, HbA1c 9.2%", ctx: { age: 58, sex: "Female", cc: "Elevated blood sugar, fatigue, polyuria", pmh: "T2DM x10yr, HTN, Obesity", meds: "Metformin 1000mg, Lisinopril 10mg", alg: "Sulfa", bp: "138/82", hr: "76", temp: "98.6°F", spo2: "98%" } },
  { id: 3, ini: "JC", name: "James C.", date: "May 11", sum: "Acute chest pain, r/o ACS", ctx: { age: 44, sex: "Male", cc: "Acute onset chest pain, diaphoresis", pmh: "Smoker 20pk-yr, FHx CAD", meds: "None", alg: "Penicillin", bp: "158/96", hr: "102", temp: "98.2°F", spo2: "97%" } },
  { id: 4, ini: "MT", name: "Maria T.", date: "May 10", sum: "Metastatic TNBC", ctx: { age: 67, sex: "Female", cc: "New bone pain, fatigue, weight loss", pmh: "Stage IV TNBC, lumpectomy + XRT", meds: "Pembrolizumab, Capecitabine", alg: "Contrast dye", bp: "128/76", hr: "82", temp: "99.1°F", spo2: "96%" } },
];

export const EHR_PTS: EhrPatient[] = [
  { mrn: "MRN-0847291", name: "Robert Martinez", age: 71, dx: "HFrEF, EF 30%", ctx: { age: 71, sex: "Male", cc: "Progressive dyspnea, bilateral LE edema", pmh: "MI (2019), HTN, HLD, HFrEF", meds: "Aspirin 81mg, Metoprolol 25mg", alg: "NKDA", bp: "142/88", hr: "88", temp: "98.4°F", spo2: "94%" } },
  { mrn: "MRN-0523168", name: "Sandra Liu", age: 58, dx: "T2DM, HTN", ctx: { age: 58, sex: "Female", cc: "Elevated blood sugar, fatigue, polyuria", pmh: "T2DM x10yr, HTN, Obesity", meds: "Metformin 1000mg, Lisinopril 10mg", alg: "Sulfa", bp: "138/82", hr: "76", temp: "98.6°F", spo2: "98%" } },
  { mrn: "MRN-0391475", name: "James Carter", age: 44, dx: "Chest pain NOS", ctx: { age: 44, sex: "Male", cc: "Acute onset chest pain, diaphoresis", pmh: "Smoker 20pk-yr, FHx CAD", meds: "None", alg: "Penicillin", bp: "158/96", hr: "102", temp: "98.2°F", spo2: "97%" } },
  { mrn: "MRN-0712836", name: "Maria Torres", age: 67, dx: "Metastatic TNBC", ctx: { age: 67, sex: "Female", cc: "New bone pain, fatigue, weight loss", pmh: "Stage IV TNBC, lumpectomy + XRT", meds: "Pembrolizumab, Capecitabine", alg: "Contrast dye", bp: "128/76", hr: "82", temp: "99.1°F", spo2: "96%" } },
  { mrn: "MRN-0654923", name: "David Patel", age: 55, dx: "Afib, CKD Stage 3", ctx: { age: 55, sex: "Male", cc: "Palpitations, mild exertional dyspnea", pmh: "Afib, CKD Stage 3, HTN", meds: "Apixaban 5mg BID, Metoprolol 50mg", alg: "NKDA", bp: "136/84", hr: "92", temp: "98.5°F", spo2: "96%" } },
  { mrn: "MRN-0418762", name: "Angela Brooks", age: 62, dx: "COPD, Emphysema", ctx: { age: 62, sex: "Female", cc: "Worsening dyspnea, productive cough x 1 week", pmh: "COPD GOLD III, Emphysema, Ex-smoker", meds: "Tiotropium inhaler, Fluticasone/salmeterol", alg: "Aspirin", bp: "128/76", hr: "84", temp: "99.0°F", spo2: "91%" } },
];

export const DDX: Ddx = {
  ml: [
    { dx: "HFrEF — Ischemic Cardiomyopathy", ev: "EF 30%, prior MI, S3, bilateral edema", r: [1, 2] },
    { dx: "Decompensated Chronic HF", ev: "Progressive dyspnea, orthopnea, LE edema", r: [2] },
  ],
  ex: [
    { dx: "Valvular HD (MR/AS)", ev: "S3 — assess for MR or AS on echo", r: [4] },
    { dx: "Cardiac Amyloidosis", ev: "Consider if wall thickness disproportionate", r: [5] },
  ],
  cm: [
    { dx: "Acute Coronary Syndrome", ev: "Prior MI — ECG + troponins stat", r: [1, 3] },
  ],
};

export const TX: TxPlan = {
  imp: "71M HFrEF EF 30%, ischemic, decompensated. GDMT + decongestion.",
  probs: [
    { l: "GDMT", items: ["Sacubitril/valsartan 24/26mg BID", "Carvedilol 3.125mg → titrate", "Spironolactone 25mg", "Dapagliflozin 10mg"], r: [1, 6] },
    { l: "Volume Overload", items: ["IV furosemide 40mg BID", "Daily weights + I&O", "Na+ <2g/day"], r: [2] },
    { l: "Post-MI Prevention", items: ["ASA 81mg", "High-intensity statin", "Reassess coronary anatomy"], r: [3] },
  ],
  fu: ["Echo 3mo", "Cardiology — ICD eval", "BMP + renal 1wk"],
};

export const MSGS: ChatMsg[] = [
  { w: "ai", t: "Good morning, Dr. Thompson. Describe the patient's presentation.", img: null },
  { w: "dr", t: "71M, prior MI. Progressive DOE, bilateral LE edema. S3, JVD. Echo EF 30%.", img: null },
  { w: "ai", t: "Generating differential diagnosis.", img: null },
  { w: "ai", t: "Most likely HFrEF ischemic etiology. DDx updated. Here's the echo for reference:", img: "echo" },
  { w: "dr", t: "Generate treatment plan.", img: null },
  { w: "ai", t: "Treatment plan generated. GDMT initiation priority per ACC/AHA 2023:", img: "chart" },
];

export const QA: QuickAction[] = [
  { i: "📋", l: "Clinical Note", d: "SOAP" },
  { i: "🏷", l: "ICD-10/CPT", d: "Codes" },
  { i: "🔬", l: "Summarize Labs", d: "Uploaded" },
  { i: "📤", l: "Export DDx", d: "PDF" },
  { i: "📞", l: "Pre-Call Brief", d: "MSL" },
  { i: "✨", l: "New Case", d: "Restart" },
];

export const DOCS_S: DocStub[] = [
  { n: "Echo Report — EF 30%", d: "May 13", on: true },
  { n: "CBC + BMP", d: "May 12", on: true },
  { n: "Prior Cardiology Note", d: "Apr 30", on: false },
];
