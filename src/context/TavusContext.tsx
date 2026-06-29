import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AveMode, AveSize } from "../lib/types";

// Phase 1: all avatar/voice state is MOCKED with timers (mirrors the preview).
// Phase 2 (TODO): replace `speaking`/`sec`/`micMuted`/devices with real Tavus CVI
//   events (conversation.replica.started_speaking, useLocalMicrophone, etc.) behind
//   VITE_USE_MOCK_TAVUS. Delete the two setInterval timers below at that point.

export interface TavusCtxValue {
  speaking: boolean;
  mode: AveMode;
  setMode: (m: AveMode) => void;
  // Whether the live AVE conversation has been started (gates the audio wave /
  // avatar behind a "Start conversation" CTA). Phase 2: set true once the real
  // Tavus conversation connects.
  convoStarted: boolean;
  setConvoStarted: (v: boolean | ((p: boolean) => boolean)) => void;
  aveOpen: boolean;
  setAveOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  aveSize: AveSize;
  setAveSize: (s: AveSize) => void;
  micMuted: boolean;
  setMicMuted: (v: boolean | ((p: boolean) => boolean)) => void;
  aveAudioOpen: boolean;
  setAveAudioOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  audioDevice: string;
  setAudioDevice: (d: string) => void;
  inputVol: number;
  setInputVol: (v: number) => void;
  sec: number;
  fmt: (s: number) => string;
}

export const TavusCtx = createContext<TavusCtxValue | null>(null);

export function TavusProvider({ children }: { children: ReactNode }) {
  const [speaking, setSpeaking] = useState(true);
  const [mode, setMode] = useState<AveMode>("ave");
  const [convoStarted, setConvoStarted] = useState(false);
  const [aveOpen, setAveOpen] = useState(false);
  const [aveSize, setAveSize] = useState<AveSize>("popup");
  const [micMuted, setMicMuted] = useState(false);
  const [aveAudioOpen, setAveAudioOpen] = useState(false);
  const [audioDevice, setAudioDevice] = useState("Default Mic");
  const [inputVol, setInputVol] = useState(75);
  const [sec, setSec] = useState(272);

  // MOCK timers — replaced by real Tavus session events in Phase 2.
  useEffect(() => {
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSpeaking((v) => !v), 3200);
    return () => clearInterval(t);
  }, []);

  const value = useMemo<TavusCtxValue>(
    () => ({
      speaking, mode, setMode, convoStarted, setConvoStarted, aveOpen, setAveOpen, aveSize, setAveSize, micMuted, setMicMuted,
      aveAudioOpen, setAveAudioOpen, audioDevice, setAudioDevice, inputVol, setInputVol,
      sec,
      fmt: (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`,
    }),
    [speaking, mode, convoStarted, aveOpen, aveSize, micMuted, aveAudioOpen, audioDevice, inputVol, sec]
  );

  return <TavusCtx.Provider value={value}>{children}</TavusCtx.Provider>;
}
