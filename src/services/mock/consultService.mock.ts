import { DOCS_S, MSGS, QA } from "../../lib/mockData";
import type { ChatMsg, DocStub, QuickAction } from "../../lib/types";

export interface ConsultService {
  getMessages(): ChatMsg[];
  getQuickActions(): QuickAction[];
  getDocuments(): DocStub[];
}

export const mockConsultService: ConsultService = {
  getMessages() {
    return MSGS;
  },
  getQuickActions() {
    return QA;
  },
  getDocuments() {
    return DOCS_S;
  },
};
