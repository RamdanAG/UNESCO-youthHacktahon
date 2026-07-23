import { create } from "zustand";
import { PLAYER_MOVEMENT_RANGE, ENEMY_MOVEMENT_RANGE } from "@/lib/constants";

export interface BoardEntity {
  id: string;
  type: "player" | "enemy";
  x: number;
  y: number;
}

interface BoardState {
  entities: BoardEntity[];
  activeEntityId: string | null;
  remainingBudget: number; // sisa jatah gerak entitas yang lagi giliran
}

interface BoardActions {
  setEntities: (entities: BoardEntity[]) => void;
  startTurn: (entityId: string) => void;
  moveEntity: (entityId: string, dx: number, dy: number) => boolean;
}

export const useBoardStore = create<BoardState & BoardActions>((set, get) => ({
  entities: [],
  activeEntityId: null,
  remainingBudget: 0,

  setEntities: (entities) => set({ entities }),

  startTurn: (entityId) => {
    const entity = get().entities.find((e) => e.id === entityId);
    if (!entity) return;

    const budget = entity.type === "player" ? PLAYER_MOVEMENT_RANGE : ENEMY_MOVEMENT_RANGE;
    set({ activeEntityId: entityId, remainingBudget: budget });
  },

  // dx/dy masing-masing HANYA salah satu boleh diisi (gerak 1 arah per panggilan),
  // dipanggil berkali-kali dalam 1 giliran untuk gabung beberapa arah
  // (misal kanan 2 lalu bawah 2), sesuai docs/WORK_BREAKDOWN.md Bagian A.2.
  moveEntity: (entityId, dx, dy) => {
    const { entities, activeEntityId, remainingBudget } = get();

    if (entityId !== activeEntityId) return false;

    const stepsUsed = Math.abs(dx) + Math.abs(dy);
    if (stepsUsed > remainingBudget) return false;

    const entity = entities.find((e) => e.id === entityId);
    if (!entity) return false;

    const newEntities = entities.map((e) =>
      e.id === entityId ? { ...e, x: e.x + dx, y: e.y + dy } : e
    );

    set({ entities: newEntities, remainingBudget: remainingBudget - stepsUsed });
    return true;
  },
}));