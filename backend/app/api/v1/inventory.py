from fastapi import APIRouter

router = APIRouter()


@router.get("/{player_id}")
def get_inventory():
    # TODO: implement get_inventory
    return {"message": "Coming Soon"}


@router.post("/add")
def add_item():
    # TODO: implement add_item
    return {"message": "Coming Soon"}

