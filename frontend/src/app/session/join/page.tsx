"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinSession } from "@/services/sessionService";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionStore } from "@/store/useSessionStore";

export default function JoinSessionPage() {
  const router = useRouter();
  const { userId, displayName } = useAuthStore();
  const setSession = useSessionStore((state) => state.setSession);

  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();

    if (!userId || !displayName) {
      setError("You must be logged in first");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const session = await joinSession(joinCode.toUpperCase(), userId, displayName);
      setSession(session, userId);
      router.push("/character");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
      <form onSubmit={handleJoin} className="w-full max-w-sm border border-neutral-700 p-6 rounded-md text-center">
        <h1 className="text-xl font-mono mb-4">Join Session</h1>
        <p className="text-sm text-neutral-500 mb-4">
          Masukkan kode room dari host.
        </p>

        <input
          type="text"
          placeholder="Join code (contoh: A3F9K)"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          required
          maxLength={10}
          className="w-full mb-3 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm text-center uppercase tracking-widest"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-neutral-100 text-neutral-900 rounded text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Joining..." : "Join Room"}
        </button>
      </form>
    </main>
  );
}