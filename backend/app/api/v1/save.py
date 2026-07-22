from fastapi import APIRouter, HTTPException

from app.models.schemas import SaveGameRequest, SaveResponse, LoadGameResponse
from app.services.save_service import save_service

router = APIRouter()


@router.post("", response_model=SaveResponse)
def save_game(payload: SaveGameRequest):
    try:
        result = save_service.save_game(payload.session_id, payload.saved_by, payload.snapshot)
        return SaveResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save game error: {str(e)}")


@router.get("/{session_id}", response_model=LoadGameResponse)
def load_game(session_id: str):
    try:
        result = save_service.load_game(session_id)
        return LoadGameResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Load game error: {str(e)}")