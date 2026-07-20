// gameService
// Placeholder API client - wire up real fetch/axios calls to FastAPI backend.

export async function rollDice(payload?: unknown) {
  // TODO: call backend /api/v1/dice/roll
  const res = await fetch("/api/v1/dice/roll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function movePlayer(payload?: unknown) {
  // TODO: call backend /api/v1/session/move
  const res = await fetch("/api/v1/session/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
