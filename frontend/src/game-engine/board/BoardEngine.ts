// BoardEngine
// Owns the grid map state at a higher level: coordinates TileEngine
// (tile types) with entity positions from useBoardStore.

import { TileEngine } from "./TileEngine";
import { useBoardStore, BoardEntity } from "@/store/useBoardStore";

export class BoardEngine {
  private tileEngine: TileEngine;

  constructor() {
    this.tileEngine = new TileEngine();
  }

  getTileEngine(): TileEngine {
    return this.tileEngine;
  }

  getEntityAt(x: number, y: number): BoardEntity | undefined {
    return useBoardStore.getState().entities.find((e) => e.x === x && e.y === y);
  }

  init(): void {
    this.tileEngine.init();
    console.log("[BoardEngine] init");
  }

  start(): void {
    console.log("[BoardEngine] start");
  }

  pause(): void {
    console.log("[BoardEngine] pause");
  }

  resume(): void {
    console.log("[BoardEngine] resume");
  }

  stop(): void {
    console.log("[BoardEngine] stop");
  }
}

export default BoardEngine;