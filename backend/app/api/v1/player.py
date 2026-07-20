from fastapi import APIRouter

router = APIRouter()


@router.get("/{player_id}")
def get_player():
    # TODO: implement get_player
    return {"message": "Coming Soon"}


@router.post("/character")
def choose_character():
    # TODO: implement choose_character
    return {"message": "Coming Soon"}

