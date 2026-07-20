from fastapi import APIRouter

router = APIRouter()


@router.post("/roll")
def roll_dice():
    # TODO: implement roll_dice
    return {"message": "Coming Soon"}

