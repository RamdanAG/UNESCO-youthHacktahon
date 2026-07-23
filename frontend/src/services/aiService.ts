// aiService
// Wired to Backend REST API - see docs/BACKEND_CONTRACT.md for exact shapes.

export async function generateArticle(payload?: unknown) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/ai/article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function checkAnswer(payload?: unknown) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/ai/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}

export async function npcDialogue(payload?: unknown) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/ai/npc-dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return res.json();
}
