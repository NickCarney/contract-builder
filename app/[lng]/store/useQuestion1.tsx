import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SplitsState {
  split: string;
  date: string;
  cid: string;
  updateSplit: (value: string) => void;
  updateDate: (value: string) => void;
  setCid: (value: string) => void;
}

const useQuestion1 = create<SplitsState>()(
  persist(
    (set) => ({
      split: "",
      date: "",
      cid: "",
      updateSplit: (value) => set({ split: value }),
      updateDate: (value) => set({ date: value }),
      setCid: (value) => set({ cid: value }),
    }),
    {
      name: "question1-storage",
      partialize: (state) => ({ split: state.split, date: state.date, cid: state.cid }),
    }
  )
);

export default useQuestion1;
