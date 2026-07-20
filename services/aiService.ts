// aiService
// Placeholder API client - wire up real fetch/axios calls to FastAPI backend.

export async function generateArticle(payload?: unknown) {
  // TODO: call backend /api/v1/ai/article
  const res = await fetch("/api/v1/ai/article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function checkAnswer(payload?: unknown) {
  // TODO: call backend /api/v1/ai/check-answer
  const res = await fetch("/api/v1/ai/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function npcDialogue(payload?: unknown) {
  // TODO: call backend /api/v1/ai/npc-dialogue
  const res = await fetch("/api/v1/ai/npc-dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
