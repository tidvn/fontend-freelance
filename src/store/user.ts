import produce from "immer";
import { create } from "zustand";
import type { User } from "@/interface/user";
import fetchClient from "@/lib/fetch-client";

interface UserState {
  userInfo: User | null;
  setUserInfo: (user: User) => void;
  fetchData: (token: any) => void;
}

export const userStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (user: User): void => set({ userInfo: user }),
  fetchData: async (token: any) => {
    if (!token) {
      return;
    }
    try {
      const response = await fetchClient({
        method: "GET",
        endpoint: "/api/user",
        token: token,
      });
      set({ userInfo: response.data });
    } catch (error) {
      set({ userInfo: null });
    }
  },
}));
