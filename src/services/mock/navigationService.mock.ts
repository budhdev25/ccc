import { NAV } from "../../lib/mockData";
import type { NavItem } from "../../lib/types";

export interface NavigationService {
  getNavItems(): NavItem[];
}

export const mockNavigationService: NavigationService = {
  getNavItems() {
    return NAV;
  },
};
