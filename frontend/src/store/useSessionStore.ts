import { create } from "zustand";

export interface SessionPlayer {
  id: string; // ini session_player_id, dipakai buat character creation
  player_id: string;
  display_name: string;
  turn_order: number;
}

interface SessionState {
  sessionId: string | null;
  joinCode: string | null;
  hostId: string | null;
  status: string | null;
  players: SessionPlayer[];
  mySessionPlayerId: string | null; // session_player_id milik user yang login
}

interface SessionActions {
  setSession: (data: {
    id: string;
    join_code: string;
    status: string;
    host_id: string;
    players: SessionPlayer[];
  }, myUserId: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  sessionId: null,
  joinCode: null,
  hostId: null,
  status: null,
  players: [],
  mySessionPlayerId: null,

  setSession: (data, myUserId) => {
    const myPlayer = data.players.find((p) => p.player_id === myUserId);
    set({
      sessionId: data.id,
      joinCode: data.join_code,
      hostId: data.host_id,
      status: data.status,
      players: data.players,
      mySessionPlayerId: myPlayer?.id ?? null,
    });
  },

  clearSession: () =>
    set({
      sessionId: null,
      joinCode: null,
      hostId: null,
      status: null,
      players: [],
      mySessionPlayerId: null,
    }),
}));