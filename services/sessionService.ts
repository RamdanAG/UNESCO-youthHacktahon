// sessionService
// Placeholder API client - wire up real fetch/axios calls to FastAPI backend.

export async function createSession(payload?: unknown) {
  // TODO: call backend /api/v1/session/create
  const res = await fetch("/api/v1/session/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function joinSession(payload?: unknown) {
  // TODO: call backend /api/v1/session/join
  const res = await fetch("/api/v1/session/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
