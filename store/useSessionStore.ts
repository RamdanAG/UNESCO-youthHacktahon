import { create } from "zustand";

// useSessionStore
// Multiplayer session/room metadata (session id, joined players).
// Placeholder shape - expand fields as engines are implemented.

interface useSessionStoreState {
  isReady: boolean;
  // TODO: add real state fields
}

interface useSessionStoreActions {
  reset: () => void;
  // TODO: add real actions
}

export const useSessionStore = create<useSessionStoreState & useSessionStoreActions>((set) => ({
  isReady: false,
  reset: () => set({ isReady: false }),
}));
