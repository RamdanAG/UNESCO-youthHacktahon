"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/services/sessionService";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionStore } from "@/store/useSessionStore";

export default function CreateSessionPage() {
  const router = useRouter();
  const { userId, displayName } = useAuthStore();
  const setSession = useSessionStore((state) => state.setSession);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    if (!userId || !displayName) {
      setError("You must be logged in first");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const session = await createSession(userId, displayName);
      setSession(session, userId);
      router.push("/character");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
      <div className="w-full max-w-sm border border-neutral-700 p-6 rounded-md text-center">
        <h1 className="text-xl font-mono mb-4">Create Session</h1>
        <p className="text-sm text-neutral-500 mb-4">
          Buat room baru untuk bermain bersama (maks 4 pemain).
        </p>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full py-2 bg-neutral-100 text-neutral-900 rounded text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </main>
  );
}