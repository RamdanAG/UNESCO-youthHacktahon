// authService
// Wired to Backend REST API - see docs/BACKEND_CONTRACT.md for exact shapes.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  display_name: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  return res.json();
}

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, display_name: displayName }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Registration failed");
  }

  return res.json();
}