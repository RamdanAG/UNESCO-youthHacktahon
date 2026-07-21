from fastapi import APIRouter, HTTPException

from app.models.schemas import CreateCharacterRequest, CharacterResponse
from app.services.character_service import character_service

router = APIRouter()


@router.post("/character", response_model=CharacterResponse)
def choose_character(payload: CreateCharacterRequest):
    try:
        result = character_service.create_character(payload.session_player_id, payload.class_id)
        return CharacterResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Create character error: {str(e)}")


@router.get("/{session_player_id}", response_model=CharacterResponse)
def get_player(session_player_id: str):
    try:
        result = character_service.get_character(session_player_id)
        return CharacterResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get character error: {str(e)}")