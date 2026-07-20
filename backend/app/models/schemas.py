from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str
    display_name: str

    # ── Session ───────────────────────────────────────────

class CreateSessionRequest(BaseModel):
    host_id: str
    display_name: str  # nama yang ditampilkan host sebagai player pertama


class JoinSessionRequest(BaseModel):
    join_code: str
    player_id: str
    display_name: str


class SessionPlayerResponse(BaseModel):
    id: str
    player_id: str
    display_name: str
    turn_order: int


class SessionResponse(BaseModel):
    id: str
    join_code: str
    status: str
    host_id: str
    players: list[SessionPlayerResponse]