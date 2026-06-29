import { DDX, TX } from "../../lib/mockData";
import type { Ddx, TxPlan } from "../../lib/types";

export interface InsightsService {
  getDifferentialDiagnosis(): Ddx;
  getTreatmentPlan(): TxPlan;
}

export const mockInsightsService: InsightsService = {
  getDifferentialDiagnosis() {
    return DDX;
  },
  getTreatmentPlan() {
    return TX;
  },
};
