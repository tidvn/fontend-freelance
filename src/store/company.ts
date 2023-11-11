import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

import type { CompanyType } from "../interface/company";

interface CompanyState {
  currentCompany: CompanyType | null;
  setCurrentCompany: (company: CompanyType) => void;
}

export const CompanyStore = create<CompanyState>((set) => ({
  currentCompany: null,
  setCurrentCompany: (company: CompanyType) => set({ currentCompany: company }),
}));
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("profileStore", CompanyStore);
}
