import { create } from "zustand";

// useStoryStore
// Story flags, current dialogue node, choice history.
// Placeholder shape - expand fields as engines are implemented.

interface useStoryStoreState {
  isReady: boolean;
  // TODO: add real state fields
}

interface useStoryStoreActions {
  reset: () => void;
  // TODO: add real actions
}

export const useStoryStore = create<useStoryStoreState & useStoryStoreActions>((set) => ({
  isReady: false,
  reset: () => set({ isReady: false }),
}));
