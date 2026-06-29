import { useMockServices } from "./config";
import type { PatientService } from "./mock/patientService.mock";
import { mockPatientService } from "./mock/patientService.mock";
import type { NavigationService } from "./mock/navigationService.mock";
import { mockNavigationService } from "./mock/navigationService.mock";
import type { ConsultService } from "./mock/consultService.mock";
import { mockConsultService } from "./mock/consultService.mock";
import type { InsightsService } from "./mock/insightsService.mock";
import { mockInsightsService } from "./mock/insightsService.mock";

export type { PatientService, NavigationService, ConsultService, InsightsService };

function resolve<T>(mock: T, _api: T): T {
  return useMockServices ? mock : _api;
}

// Phase 2+: pass real HTTP-backed implementations as the second argument.
export const patientService = resolve(mockPatientService, mockPatientService);
export const navigationService = resolve(mockNavigationService, mockNavigationService);
export const consultService = resolve(mockConsultService, mockConsultService);
export const insightsService = resolve(mockInsightsService, mockInsightsService);
