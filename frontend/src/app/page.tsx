"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, displayName);

      setAuth(result);
      router.push("/session/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-neutral-700 p-6 rounded-md">
        <h1 className="text-xl font-mono mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-neutral-100 text-neutral-900 rounded text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full mt-3 text-xs text-neutral-500 underline"
        >
          {mode === "login" ? "Belum punya akun? Register" : "Sudah punya akun? Login"}
        </button>
      </form>
    </main>
  );
}