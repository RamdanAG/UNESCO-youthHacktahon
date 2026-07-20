// Shared game type definitions - placeholder, expand as engines solidify.

export interface Player {
  id: string;
  name: string;
  characterId: string;
  x: number;
  y: number;
  inventory: string[];
}

export interface Tile {
  x: number;
  y: number;
  type: "empty" | "event" | "npc" | "blocked";
  eventId?: string;
}

export interface StoryFlag {
  key: string;
  value: string | number | boolean;
}
