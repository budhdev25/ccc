import { useMemo } from "react";
import { patientService } from "../services";
import type { EhrPatient } from "../lib/types";

// Phase 1: synchronous filter over mock EHR patients via patientService.
// Phase 4 (TODO): debounced SMART-on-FHIR query returning the same EhrPatient[] shape.
export function useEHRSearch(query: string): EhrPatient[] {
  return useMemo(() => patientService.searchEhrPatients(query), [query]);
}
