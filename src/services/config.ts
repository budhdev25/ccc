// Service layer configuration. Mock implementations are the default until
// Phase 2+ backend endpoints replace them one domain at a time.

export const useMockServices = import.meta.env.VITE_USE_MOCK !== "false";
