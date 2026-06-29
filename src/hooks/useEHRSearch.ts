import { useMemo } from "react";
import { EHR_PTS } from "../lib/mockData";
import type { EhrPatient } from "../lib/types";

// Phase 1: synchronous filter over the 6 synthetic EHR patients.
// Phase 4 (TODO): swap the body for a debounced SMART-on-FHIR query that returns
//   the same EhrPatient[] shape, behind a real EHR partner.
export function useEHRSearch(query: string): EhrPatient[] {
  return useMemo(() => {
    if (query.length <= 1) return [];
    const q = query.toLowerCase();
    return EHR_PTS.filter(
      (x) => x.name.toLowerCase().includes(q) || x.mrn.includes(query)
    );
  }, [query]);
}
