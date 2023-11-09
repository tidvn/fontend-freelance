import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import type { User } from "@/interface/user";
import fetchClient from "@/lib/fetch-client";

interface UserState {
  userInfo: any | null;
  setUserInfo: (user: User) => void;
  fetchData:(token:any)=>void
}

export const userStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (user: User): void =>
    set(
      produce((state: UserState) => {
        state.userInfo = user;
      })
    ),
  fetchData: async (token: any) => {
    if(!token){
      return
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
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("profileStore", userStore);
}
