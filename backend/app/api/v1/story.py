from fastapi import APIRouter, HTTPException

from app.models.schemas import SetStoryFlagRequest, StoryFlagResponse, StoryStateResponse
from app.services.story_service import story_service

router = APIRouter()


@router.post("/flag", response_model=StoryFlagResponse)
def set_story_flag(payload: SetStoryFlagRequest):
    try:
        result = story_service.set_flag(payload.session_id, payload.flag_key, payload.flag_value)
        return StoryFlagResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Set story flag error: {str(e)}")


@router.get("/{session_id}", response_model=StoryStateResponse)
def get_story_state(session_id: str):
    try:
        result = story_service.get_story_state(session_id)
        return StoryStateResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get story state error: {str(e)}")