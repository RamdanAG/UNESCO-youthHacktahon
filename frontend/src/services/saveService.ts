// saveService
// Wired to Backend REST API - see docs/BACKEND_CONTRACT.md for exact shapes.

export async function saveGame(payload?: unknown) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function loadGame(payload?: unknown) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/save/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
