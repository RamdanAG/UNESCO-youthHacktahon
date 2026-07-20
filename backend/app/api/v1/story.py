from fastapi import APIRouter

router = APIRouter()


@router.get("/{session_id}")
def get_story_state():
    # TODO: implement get_story_state
    return {"message": "Coming Soon"}


@router.post("/flag")
def set_story_flag():
    # TODO: implement set_story_flag
    return {"message": "Coming Soon"}

