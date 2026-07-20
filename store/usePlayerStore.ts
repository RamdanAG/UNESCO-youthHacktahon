import { create } from "zustand";

// usePlayerStore
// State for the 4 local players (character, position, HP/status).
// Placeholder shape - expand fields as engines are implemented.

interface usePlayerStoreState {
  isReady: boolean;
  // TODO: add real state fields
}

interface usePlayerStoreActions {
  reset: () => void;
  // TODO: add real actions
}

export const usePlayerStore = create<usePlayerStoreState & usePlayerStoreActions>((set) => ({
  isReady: false,
  reset: () => set({ isReady: false }),
}));
