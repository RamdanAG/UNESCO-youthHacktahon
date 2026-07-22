from fastapi import APIRouter

from app.models.schemas import DiceRollRequest, DiceRollResponse
from app.services.dice_service import dice_service

router = APIRouter()


@router.post("/roll", response_model=DiceRollResponse)
def roll_dice(payload: DiceRollRequest):
    result = dice_service.roll(payload.sides)
    return DiceRollResponse(result=result)