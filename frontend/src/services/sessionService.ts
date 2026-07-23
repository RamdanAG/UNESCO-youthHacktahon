// sessionService
// Wired to Backend REST API - see docs/BACKEND_CONTRACT.md for exact shapes.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface SessionPlayerData {
  id: string;
  player_id: string;
  display_name: string;
  turn_order: number;
}

export interface SessionData {
  id: string;
  join_code: string;
  status: string;
  host_id: string;
  players: SessionPlayerData[];
}

async function handleResponse(res: Response): Promise<SessionData> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Session request failed");
  }
  return res.json();
}

export async function createSession(hostId: string, displayName: string): Promise<SessionData> {
  const res = await fetch(`${BASE_URL}/api/v1/session/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host_id: hostId, display_name: displayName }),
  });
  return handleResponse(res);
}

export async function joinSession(
  joinCode: string,
  playerId: string,
  displayName: string
): Promise<SessionData> {
  const res = await fetch(`${BASE_URL}/api/v1/session/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ join_code: joinCode, player_id: playerId, display_name: displayName }),
  });
  return handleResponse(res);
}