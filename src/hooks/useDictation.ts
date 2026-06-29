import { useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionCtor,
  type SpeechRecognitionEvent,
  type SpeechRecognitionInstance,
} from "../lib/speechRecognition";

// Microphone dictation for the chat composer — distinct from the AVE avatar mic.
// Uses the Web Speech API when available; otherwise reports unsupported so the UI
// can show a disabled/explanatory state. Final transcripts are pushed to onText.
export function useDictation(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTextRef = useRef(onText);

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  const supported = getSpeechRecognitionCtor() !== undefined;

  useEffect(() => () => { try { recRef.current?.stop(); } catch { /* noop */ } }, []);

  const toggle = () => {
    const SR = getSpeechRecognitionCtor();
    if (!SR) return;
    if (listening) {
      try { recRef.current?.stop(); } catch { /* noop */ }
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
      }
      if (finalText) onTextRef.current(finalText.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return { listening, supported, toggle };
}
