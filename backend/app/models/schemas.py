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

    # ── Character ─────────────────────────────────────────

class CreateCharacterRequest(BaseModel):
    session_player_id: str
    class_id: str


class CharacterResponse(BaseModel):
    id: str
    session_player_id: str
    class_id: str
    class_name: str
    level: int
    exp: int
    str_stat: int
    dex: int
    con: int
    int_stat: int
    wis: int
    current_hp: int
    max_hp: int
    current_mp: int
    max_mp: int
    armor_class: int
    unspent_stat_points: int

    # ── Battle ────────────────────────────────────────────

class StartBattleRequest(BaseModel):
    session_id: str
    enemy_name: str
    enemy_ac: int
    enemy_max_hp: int


class BattleResponse(BaseModel):
    id: str
    session_id: str
    status: str
    enemy_name: str
    enemy_ac: int
    enemy_max_hp: int
    enemy_current_hp: int
    turn_order: list[str]
    current_turn_index: int


class SubmitActionRequest(BaseModel):
    battle_id: str
    character_id: str
    skill_id: str | None = None  # None = Basic Attack
    target_type: str  # "enemy" | "ally" | "self"


class ActionDifficultyResponse(BaseModel):
    action_id: str
    difficulty: int
    skill_id: str | None
    mp_cost: int


class ResolveActionRequest(BaseModel):
    is_correct: bool  # SEMENTARA: manual, nanti diganti hasil dari AI check-answer


class ResolveActionResponse(BaseModel):
    action_id: str
    is_correct: bool
    is_hit: bool
    damage_dealt: int
    enemy_current_hp: int
    character_current_mp: int
    battle_status: str
    next_turn_character_id: str | None

    # ── Story ─────────────────────────────────────────────

class SetStoryFlagRequest(BaseModel):
    session_id: str
    flag_key: str
    flag_value: str


class StoryFlagResponse(BaseModel):
    flag_key: str
    flag_value: str


class StoryStateResponse(BaseModel):
    session_id: str
    current_scene_id: str | None
    flags: list[StoryFlagResponse]lan