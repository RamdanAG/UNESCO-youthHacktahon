import { create } from "zustand";

// useGameStore
// Global game session state (current scene, phase).
// Placeholder shape - expand fields as engines are implemented.

interface useGameStoreState {
  isReady: boolean;
  // TODO: add real state fields
}

interface useGameStoreActions {
  reset: () => void;
  // TODO: add real actions
}

export const useGameStore = create<useGameStoreState & useGameStoreActions>((set) => ({
  isReady: false,
  reset: () => set({ isReady: false }),
}));
