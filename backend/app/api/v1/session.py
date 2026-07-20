from fastapi import APIRouter, HTTPException

from app.models.schemas import CreateSessionRequest, JoinSessionRequest, SessionResponse
from app.services.session_service import session_service

router = APIRouter()


@router.post("/create", response_model=SessionResponse)
def create_session(payload: CreateSessionRequest):
    try:
        result = session_service.create_session(payload.host_id, payload.display_name)
        return SessionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Create session error: {str(e)}")


@router.post("/join", response_model=SessionResponse)
def join_session(payload: JoinSessionRequest):
    try:
        result = session_service.join_session(payload.join_code, payload.player_id, payload.display_name)
        return SessionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Join session error: {str(e)}")