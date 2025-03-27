import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SplitsState {
  split: string;
  date: string;
  cid: string;
  splitType: string;
  updateSplit: (value: string) => void;
  updateDate: (value: string) => void;
  setCid: (value: string) => void;
  setSplitType: (value: string) => void;
}

const useQuestion1 = create<SplitsState>()(
  persist(
    (set) => ({
      split: "",
      date: "",
      cid: "",
      splitType: "",
      updateSplit: (value) => set({ split: value }),
      updateDate: (value) => set({ date: value }),
      setCid: (value) => set({ cid: value }),
      setSplitType: (value) => set({ splitType: value }),
    }),
    {
      name: "question1-storage",
      partialize: (state) => ({ split: state.split, date: state.date, cid: state.cid, splitType: state.splitType }),
    }
  )
);

export default useQuestion1;
