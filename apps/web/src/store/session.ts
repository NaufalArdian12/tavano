import { create } from "zustand";

type S = {
  token: string | null;
  ready: boolean;
  setToken: (t: string | null) => void;
  setReady: (v: boolean) => void;
};

export const useSession = create<S>((set) => ({
  token: localStorage.getItem("token"),
  ready: false,
  setToken: (t) => {
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    set({ token: t });
  },
  setReady: (v) => set({ ready: v }),
}));
  