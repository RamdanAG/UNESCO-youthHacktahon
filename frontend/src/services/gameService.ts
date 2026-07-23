// gameService
// Wired to Backend REST API - see docs/BACKEND_CONTRACT.md for exact shapes.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface CharacterData {
  id: string;
  session_player_id: string;
  class_id: string;
  class_name: string;
  level: number;
  exp: number;
  str_stat: number;
  dex: number;
  con: number;
  int_stat: number;
  wis: number;
  current_hp: number;
  max_hp: number;
  current_mp: number;
  max_mp: number;
  armor_class: number;
  unspent_stat_points: number;
}

export async function chooseCharacter(sessionPlayerId: string, classId: string): Promise<CharacterData> {
  const res = await fetch(`${BASE_URL}/api/v1/player/character`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_player_id: sessionPlayerId, class_id: classId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create character");
  }

  return res.json();
}

export async function rollDice(sides: number = 6): Promise<{ result: number }> {
  const res = await fetch(`${BASE_URL}/api/v1/dice/roll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sides }),
  });
  return res.json();
}