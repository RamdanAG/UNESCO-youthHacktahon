from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.supabase_client import supabase

from app.api.v1 import (
    auth,
    session,
    player,
    story,
    dialogue,
    dice,
    inventory,
    ending,
    ai_gateway,
    battle,
)

app = FastAPI(title="UNESCO Youth Hackathon - Educational AI Board Game API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(session.router, prefix="/api/v1/session", tags=["session"])
app.include_router(player.router, prefix="/api/v1/player", tags=["player"])
app.include_router(story.router, prefix="/api/v1/story", tags=["story"])
app.include_router(dialogue.router, prefix="/api/v1/dialogue", tags=["dialogue"])
app.include_router(dice.router, prefix="/api/v1/dice", tags=["dice"])
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["inventory"])
app.include_router(ending.router, prefix="/api/v1/ending", tags=["ending"])
app.include_router(ai_gateway.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(battle.router, prefix="/api/v1/battle", tags=["battle"])


@app.get("/health/db")
def health_check_db():
    result = supabase.table("classes").select("*").execute()
    return {"status": "ok", "classes_count": len(result.data), "data": result.data}