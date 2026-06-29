import { useContext } from "react";
import { TavusCtx } from "../context/TavusContext";

export function useTavus() {
  const ctx = useContext(TavusCtx);
  if (!ctx) throw new Error("useTavus must be used within TavusProvider");
  return ctx;
}
