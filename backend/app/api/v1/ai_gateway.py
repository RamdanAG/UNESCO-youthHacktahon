from fastapi import APIRouter

router = APIRouter()


@router.post("/article")
def generate_article():
    # TODO: implement generate_article
    return {"message": "Coming Soon"}


@router.post("/check-answer")
def check_answer():
    # TODO: implement check_answer
    return {"message": "Coming Soon"}


@router.post("/npc-dialogue")
def npc_dialogue():
    # TODO: implement npc_dialogue
    return {"message": "Coming Soon"}


@router.post("/narration")
def story_narration():
    # TODO: implement story_narration
    return {"message": "Coming Soon"}

