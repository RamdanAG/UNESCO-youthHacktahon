from fastapi import APIRouter

router = APIRouter()


@router.get("/{session_id}")
def get_ending():
    # TODO: implement get_ending
    return {"message": "Coming Soon"}

