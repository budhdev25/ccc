import { useContext } from "react";
import { ConsultCtx } from "../context/ConsultContext";

export function useConsult() {
  const ctx = useContext(ConsultCtx);
  if (!ctx) throw new Error("useConsult must be used within ConsultProvider");
  return ctx;
}
