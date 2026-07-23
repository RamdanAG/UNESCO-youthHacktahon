"use client";

import { useEffect } from "react";
import Board from "@/components/game/Board";
import HUD from "@/components/game/HUD";
import DialogueBox from "@/components/game/DialogueBox";
import ChoiceBox from "@/components/game/ChoiceBox";
import DiceUI from "@/components/game/DiceUI";
import MiniMap from "@/components/game/MiniMap";
import Inventory from "@/components/game/Inventory";
import PauseMenu from "@/components/game/PauseMenu";
import SaveMenu from "@/components/game/SaveMenu";
import LoadingScreen from "@/components/game/LoadingScreen";
import Notification from "@/components/game/Notification";
import { GameEngine } from "@/game-engine/core/GameEngine";
import { useBoardStore } from "@/store/useBoardStore";

// This is the ONLY gameplay route. All scenes (board, dialogue, endings)
// are managed internally by SceneEngine - do NOT add /game/chapter1 etc.

export default function GamePage() {
  const setEntities = useBoardStore((state) => state.setEntities);
  const startTurn = useBoardStore((state) => state.startTurn);

  useEffect(() => {
    const engine = new GameEngine();
    engine.init();
    engine.start();

    // TODO: ganti dengan data karakter asli dari session begitu battle/board
    // sesungguhnya terhubung ke Backend - ini cuma dummy untuk tes visual.
    setEntities([
      { id: "player-1", type: "player", x: 2, y: 2 },
      { id: "enemy-1", type: "enemy", x: 7, y: 5 },
    ]);
    startTurn("player-1");

    return () => engine.stop();
  }, [setEntities, startTurn]);

  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden p-8">
      <HUD />
      <div className="mt-6">
        <Board />
      </div>
      <MiniMap />
      <DialogueBox />
      <ChoiceBox />
      <DiceUI />
      <Inventory />
      <PauseMenu />
      <SaveMenu />
      <LoadingScreen />
      <Notification />
    </main>
  );
}