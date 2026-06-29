import { useContext } from "react";
import { LayoutCtx } from "../context/LayoutContext";

export function useLayout() {
  const ctx = useContext(LayoutCtx);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
