from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    StartBattleRequest,
    BattleResponse,
    SubmitActionRequest,
    ActionDifficultyResponse,
    ResolveActionRequest,
    ResolveActionResponse,
)
from app.services.battle_service import battle_service

router = APIRouter()


@router.post("/start", response_model=BattleResponse)
def start_battle(payload: StartBattleRequest):
    try:
        result = battle_service.start_battle(
            payload.session_id, payload.enemy_name, payload.enemy_ac, payload.enemy_max_hp
        )
        return BattleResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Start battle error: {str(e)}")


@router.post("/action", response_model=ActionDifficultyResponse)
def submit_action(payload: SubmitActionRequest):
    try:
        result = battle_service.submit_action(
            payload.battle_id, payload.character_id, payload.skill_id, payload.target_type
        )
        return ActionDifficultyResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submit action error: {str(e)}")


@router.post("/action/{action_id}/resolve", response_model=ResolveActionResponse)
def resolve_action(action_id: str, payload: ResolveActionRequest):
    try:
        result = battle_service.resolve_action(action_id, payload.is_correct)
        return ResolveActionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resolve action error: {str(e)}")