"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { chooseCharacter } from "@/services/gameService";
import { useSessionStore } from "@/store/useSessionStore";

const CLASSES = [
  { id: "WIZ-01", name: "Wizard", desc: "Sihir jarak jauh, MP tinggi" },
  { id: "PRI-01", name: "Priestess", desc: "Heal & buff, HP-MP seimbang" },
  { id: "ROG-01", name: "Rogue", desc: "Serangan cepat, Energy tinggi" },
  { id: "FGT-01", name: "Fighter", desc: "Fisik kuat, Stamina tinggi" },
];

export default function CharacterCreationPage() {
  const router = useRouter();
  const mySessionPlayerId = useSessionStore((state) => state.mySessionPlayerId);

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    if (!mySessionPlayerId || !selectedClass) {
      setError("Pilih kelas dan pastikan sudah gabung session");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await chooseCharacter(mySessionPlayerId, selectedClass);
      router.push("/game");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create character");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
      <div className="w-full max-w-md border border-neutral-700 p-6 rounded-md">
        <h1 className="text-xl font-mono mb-4 text-center">Choose Character</h1>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`p-3 border rounded text-left text-sm ${
                selectedClass === cls.id
                  ? "border-neutral-100 bg-neutral-900"
                  : "border-neutral-700"
              }`}
            >
              <div className="font-medium">{cls.name}</div>
              <div className="text-xs text-neutral-500">{cls.desc}</div>
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={isLoading || !selectedClass}
          className="w-full py-2 bg-neutral-100 text-neutral-900 rounded text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Confirm"}
        </button>
      </div>
    </main>
  );
}