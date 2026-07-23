// TileEngine
// Owns tile-type data for the grid and tile trigger behavior
// (event tile, blocked tile, etc).

import { BOARD_WIDTH, BOARD_HEIGHT } from "@/lib/constants";

export type TileType = "empty" | "event" | "npc" | "blocked";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  eventId?: string;
}

export class TileEngine {
  private tiles: Map<string, Tile> = new Map();

  constructor() {
    this.generateEmptyGrid();
  }

  private key(x: number, y: number): string {
    return `${x},${y}`;
  }

  private generateEmptyGrid(): void {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        this.tiles.set(this.key(x, y), { x, y, type: "empty" });
      }
    }
  }

  getTile(x: number, y: number): Tile | undefined {
    return this.tiles.get(this.key(x, y));
  }

  setTile(x: number, y: number, type: TileType, eventId?: string): void {
    this.tiles.set(this.key(x, y), { x, y, type, eventId });
  }

  isBlocked(x: number, y: number): boolean {
    return this.getTile(x, y)?.type === "blocked";
  }

  getAllTiles(): Tile[] {
    return Array.from(this.tiles.values());
  }

  init(): void {
    console.log("[TileEngine] init");
  }

  start(): void {
    console.log("[TileEngine] start");
  }

  pause(): void {
    console.log("[TileEngine] pause");
  }

  resume(): void {
    console.log("[TileEngine] resume");
  }

  stop(): void {
    console.log("[TileEngine] stop");
  }
}

export default TileEngine;