from fastapi import APIRouter

router = APIRouter()


@router.get("/{node_id}")
def get_dialogue_node():
    # TODO: implement get_dialogue_node
    return {"message": "Coming Soon"}


@router.post("/choice")
def submit_choice():
    # TODO: implement submit_choice
    return {"message": "Coming Soon"}

