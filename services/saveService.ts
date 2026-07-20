// saveService
// Placeholder API client - wire up real fetch/axios calls to FastAPI backend.

export async function saveGame(payload?: unknown) {
  // TODO: call backend /api/v1/save
  const res = await fetch("/api/v1/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function loadGame(payload?: unknown) {
  // TODO: call backend /api/v1/save/load
  const res = await fetch("/api/v1/save/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
