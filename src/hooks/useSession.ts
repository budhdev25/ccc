import { useContext } from "react";
import { SessionCtx } from "../context/SessionContext";

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
