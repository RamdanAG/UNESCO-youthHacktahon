// authService
// Placeholder API client - wire up real fetch/axios calls to FastAPI backend.

export async function login(payload?: unknown) {
  // TODO: call backend /api/v1/auth/login
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function register(payload?: unknown) {
  // TODO: call backend /api/v1/auth/register
  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
