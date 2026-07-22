from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    GenerateArticleRequest,
    ArticleResponse,
    CheckAnswerRequest,
    CheckAnswerResponse,
    NpcDialogueRequest,
    NpcDialogueResponse,
    NarrationRequest,
    NarrationResponse,
)
from app.services.ai_gateway_service import ai_gateway_service

router = APIRouter()


@router.post("/article", response_model=ArticleResponse)
def generate_article(payload: GenerateArticleRequest):
    try:
        result = ai_gateway_service.generate_article(payload.topic, payload.difficulty)
        return ArticleResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/check-answer", response_model=CheckAnswerResponse)
def check_answer(payload: CheckAnswerRequest):
    try:
        result = ai_gateway_service.check_answer(payload.question_id, payload.answer)
        return CheckAnswerResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/npc-dialogue", response_model=NpcDialogueResponse)
def npc_dialogue(payload: NpcDialogueRequest):
    try:
        result = ai_gateway_service.npc_dialogue(payload.npc_id, payload.context)
        return NpcDialogueResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/narration", response_model=NarrationResponse)
def story_narration(payload: NarrationRequest):
    try:
        result = ai_gateway_service.narration(payload.scene_id)
        return NarrationResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))