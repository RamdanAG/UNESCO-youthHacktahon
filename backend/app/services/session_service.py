import random
import string

from app.db.supabase_client import supabase


def _generate_join_code(length: int = 5) -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choice(chars) for _ in range(length))


class SessionService:
    def create_session(self, host_id: str, display_name: str) -> dict:
        join_code = _generate_join_code()

        session_result = supabase.table("sessions").insert({
            "host_id": host_id,
            "join_code": join_code,
            "status": "waiting",
        }).execute()

        session = session_result.data[0]

        player_result = supabase.table("session_players").insert({
            "session_id": session["id"],
            "player_id": host_id,
            "turn_order": 0,
        }).execute()

        return self._build_session_response(session, [player_result.data[0]], {host_id: display_name})

    def join_session(self, join_code: str, player_id: str, display_name: str) -> dict:
        session_result = supabase.table("sessions").select("*").eq("join_code", join_code).execute()

        if not session_result.data:
            raise ValueError("Session not found")

        session = session_result.data[0]

        if session["status"] != "waiting":
            raise ValueError("Session is not accepting new players")

        existing_players = supabase.table("session_players").select("*").eq("session_id", session["id"]).execute()

        if len(existing_players.data) >= 4:
            raise ValueError("Session is full (max 4 players)")

        if any(p["player_id"] == player_id for p in existing_players.data):
            raise ValueError("Player already joined this session")

        next_turn_order = len(existing_players.data)

        player_result = supabase.table("session_players").insert({
            "session_id": session["id"],
            "player_id": player_id,
            "turn_order": next_turn_order,
        }).execute()

        all_players = existing_players.data + [player_result.data[0]]

        # ambil display_name semua pemain dari profiles
        player_ids = [p["player_id"] for p in all_players]
        profiles = supabase.table("profiles").select("id, display_name").in_("id", player_ids).execute()
        name_map = {p["id"]: p["display_name"] for p in profiles.data}

        return self._build_session_response(session, all_players, name_map)

    def _build_session_response(self, session: dict, players: list, name_map: dict) -> dict:
        return {
            "id": session["id"],
            "join_code": session["join_code"],
            "status": session["status"],
            "host_id": session["host_id"],
            "players": [
                {
                    "id": p["id"],
                    "player_id": p["player_id"],
                    "display_name": name_map.get(p["player_id"], "Unknown"),
                    "turn_order": p["turn_order"],
                }
                for p in players
            ],
        }


session_service = SessionService()