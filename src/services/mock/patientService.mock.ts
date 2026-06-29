import { EHR_PTS, PTS } from "../../lib/mockData";
import type { EhrPatient, Patient } from "../../lib/types";

export interface PatientService {
  searchEhrPatients(query: string): EhrPatient[];
  getPatientByIndex(ptIdx: number): Patient | undefined;
}

export const mockPatientService: PatientService = {
  searchEhrPatients(query) {
    if (query.length <= 1) return [];
    const q = query.toLowerCase();
    return EHR_PTS.filter(
      (x) => x.name.toLowerCase().includes(q) || x.mrn.includes(query)
    );
  },
  getPatientByIndex(ptIdx) {
    if (ptIdx < 0 || ptIdx >= PTS.length) return undefined;
    return PTS[ptIdx];
  },
};
