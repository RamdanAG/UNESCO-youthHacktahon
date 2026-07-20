import { create } from "zustand";

// useBoardStore
// Board grid state: tiles, tokens, turn order.
// Placeholder shape - expand fields as engines are implemented.

interface useBoardStoreState {
  isReady: boolean;
  // TODO: add real state fields
}

interface useBoardStoreActions {
  reset: () => void;
  // TODO: add real actions
}

export const useBoardStore = create<useBoardStoreState & useBoardStoreActions>((set) => ({
  isReady: false,
  reset: () => set({ isReady: false }),
}));
