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

// This is the ONLY gameplay route. All scenes (board, dialogue, endings)
// are managed internally by SceneEngine - do NOT add /game/chapter1 etc.

export default function GamePage() {
  useEffect(() => {
    const engine = new GameEngine();
    engine.init();
    engine.start();
    return () => engine.stop();
  }, []);

  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden">
      {/* TODO: SceneEngine decides which of these panels are active */}
      <HUD />
      <Board />
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
