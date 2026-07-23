"use client";

import { useMemo } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardEngine } from "@/game-engine/board/BoardEngine";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/lib/constants";

// TODO: pindahkan instance BoardEngine ke GameEngine/context bersama begitu
// SceneEngine sudah mengatur siklus hidup semua engine - untuk sekarang
// dibuat langsung di sini supaya Board bisa render tanpa dependency lain dulu.
const boardEngine = new BoardEngine();
boardEngine.init();

export default function Board() {
  const entities = useBoardStore((state) => state.entities);

  const tiles = useMemo(() => boardEngine.getTileEngine().getAllTiles(), []);

  return (
    <div
      className="grid gap-px bg-neutral-800 p-2 rounded-md w-fit mx-auto"
      style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 32px)` }}
    >
      {tiles.map((tile) => {
        const entity = entities.find((e) => e.x === tile.x && e.y === tile.y);

        return (
          <div
            key={`${tile.x},${tile.y}`}
            className={`w-8 h-8 flex items-center justify-center text-xs rounded-sm ${
              tile.type === "blocked"
                ? "bg-neutral-700"
                : tile.type === "event"
                ? "bg-amber-900"
                : "bg-neutral-900"
            }`}
          >
            {entity && (
              <span
                className={`w-5 h-5 rounded-full ${
                  entity.type === "player" ? "bg-blue-400" : "bg-red-400"
                }`}
                title={entity.id}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}