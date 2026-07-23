// MovementEngine
// Validates and executes grid movement within each entity's fixed movement
// budget (NOT dice-based - see docs/WORK_BREAKDOWN.md Bagian A.2).
// Player characters: 4 tiles/turn. Enemies: 6 tiles/turn. Budget can be
// split across multiple direction segments within the same turn.

import { useBoardStore } from "@/store/useBoardStore";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/lib/constants";
import { TileEngine } from "./TileEngine";

export type Direction = "up" | "down" | "left" | "right";

const DIRECTION_DELTA: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export class MovementEngine {
  private tileEngine: TileEngine;

  constructor(tileEngine: TileEngine) {
    this.tileEngine = tileEngine;
  }

  init(): void {
    console.log("[MovementEngine] init");
  }

  // Coba gerak 1 entitas sejauh `steps` kotak ke 1 arah tertentu.
  // Return true kalau berhasil (budget cukup, tidak keluar grid, tidak
  // kena tile blocked), false kalau ditolak.
  moveDirection(entityId: string, direction: Direction, steps: number): boolean {
    const board = useBoardStore.getState();
    const entity = board.entities.find((e) => e.id === entityId);
    if (!entity) return false;

    const { dx, dy } = DIRECTION_DELTA[direction];
    const targetX = entity.x + dx * steps;
    const targetY = entity.y + dy * steps;

    if (targetX < 0 || targetX >= BOARD_WIDTH || targetY < 0 || targetY >= BOARD_HEIGHT) {
      console.warn("[MovementEngine] move rejected: out of board bounds");
      return false;
    }

    if (this.tileEngine.isBlocked(targetX, targetY)) {
      console.warn("[MovementEngine] move rejected: tile is blocked");
      return false;
    }

    return board.moveEntity(entityId, dx * steps, dy * steps);
  }

  start(): void {
    console.log("[MovementEngine] start");
  }

  pause(): void {
    console.log("[MovementEngine] pause");
  }

  resume(): void {
    console.log("[MovementEngine] resume");
  }

  stop(): void {
    console.log("[MovementEngine] stop");
  }
}

export default MovementEngine;