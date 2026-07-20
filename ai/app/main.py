from fastapi import FastAPI
from app.generation import article_generator, fact_checker, npc_dialogue, narration

app = FastAPI(title="UNESCO Hackathon AI Service (Ollama + RAG)")


@app.post("/article")
def generate_article(topic: str):
    return article_generator.generate(topic)


@app.post("/check-answer")
def check_answer(question_id: str, answer: str):
    return fact_checker.check(question_id, answer)


@app.post("/npc-dialogue")
def npc_dialogue_endpoint(npc_id: str, context: str):
    return npc_dialogue.generate(npc_id, context)


@app.post("/narration")
def story_narration(scene_id: str):
    return narration.generate(scene_id)
