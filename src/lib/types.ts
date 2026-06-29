// Shared domain types for the Clinical Command Center.

export interface PatientCtx {
  age: number;
  sex: string;
  cc: string;
  pmh: string;
  meds: string;
  alg: string;
  bp: string;
  hr: string;
  temp: string;
  spo2: string;
  // Attached when a session/patient is loaded:
  name?: string;
  mrn?: string;
}

export interface Patient {
  id: number;
  ini: string;
  name: string;
  date: string;
  sum: string;
  ctx: PatientCtx;
}

export interface EhrPatient {
  mrn: string;
  name: string;
  age: number;
  dx: string;
  ctx: PatientCtx;
}

export interface NavItem {
  id: ViewId;
  icon: string;
  label: string;
}

export type ViewId =
  | "clinical"
  | "schedule"
  | "cme"
  | "medsights"
  | "concierge"
  | "scribe"
  | "docs";

export interface Session {
  id: number;
  title: string;
  ptIdx: number;
  timestamp: string;
}

export interface DxItem {
  dx: string;
  ev: string;
  r: number[];
}

export interface Ddx {
  ml: DxItem[];
  ex: DxItem[];
  cm: DxItem[];
}

export interface TxProblem {
  l: string;
  items: string[];
  r: number[];
}

export interface TxPlan {
  imp: string;
  probs: TxProblem[];
  fu: string[];
}

export interface ChatMsg {
  w: "ai" | "dr";
  t: string;
  img: "echo" | "chart" | null;
}

export interface QuickAction {
  i: string;
  l: string;
  d: string;
}

export interface DocStub {
  n: string;
  d: string;
  on: boolean;
}

export type SessionMode = "new" | "active";
export type AveMode = "ave" | "visual";
export type AveSize = "popup" | "modal" | "fullscreen";
export type CtrlTab = "chat" | "docs" | "actions";
export type InsightTab = "ddx" | "tx";
