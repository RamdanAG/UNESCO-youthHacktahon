import httpx

from app.core.config import settings


class AIGatewayService:
    def _post(self, path: str, payload: dict) -> dict:
        url = f"{settings.ai_service_url}{path}"
        try:
            response = httpx.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except httpx.ConnectError:
            raise ValueError(f"AI service is not reachable at {settings.ai_service_url}. Is it running?")
        except httpx.HTTPStatusError as e:
            raise ValueError(f"AI service returned error: {e.response.status_code} - {e.response.text}")

    def generate_article(self, topic: str, difficulty: int) -> dict:
        return self._post("/article", {"topic": topic, "difficulty": difficulty})

    def check_answer(self, question_id: str, answer: str) -> dict:
        return self._post("/check-answer", {"question_id": question_id, "answer": answer})

    def npc_dialogue(self, npc_id: str, context: str) -> dict:
        return self._post("/npc-dialogue", {"npc_id": npc_id, "context": context})

    def narration(self, scene_id: str) -> dict:
        return self._post("/narration", {"scene_id": scene_id})


ai_gateway_service = AIGatewayService()