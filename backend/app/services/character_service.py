import math

from app.db.supabase_client import supabase


def _modifier(stat: int) -> int:
    # Rumus GDD: (Nilai Status - 10) / 2, dibulatkan ke bawah
    return math.floor((stat - 10) / 2)


class CharacterService:
    def create_character(self, session_player_id: str, class_id: str) -> dict:
        class_result = supabase.table("classes").select("*").eq("id", class_id).execute()

        if not class_result.data:
            raise ValueError(f"Class {class_id} not found")

        cls = class_result.data[0]

        existing = supabase.table("characters").select("id").eq("session_player_id", session_player_id).execute()
        if existing.data:
            raise ValueError("Character already created for this session player")

        level = 1
        con_mod = _modifier(cls["base_con"])
        wis_mod = _modifier(cls["base_wis"])

        max_hp = (cls["base_hp"] * level) + (con_mod * level)
        max_mp = (cls["base_mp"] * level) + (wis_mod * level)

        insert_result = supabase.table("characters").insert({
            "session_player_id": session_player_id,
            "class_id": class_id,
            "level": level,
            "exp": 0,
            "str": cls["base_str"],
            "dex": cls["base_dex"],
            "con": cls["base_con"],
            "int_stat": cls["base_int"],
            "wis": cls["base_wis"],
            "current_hp": max_hp,
            "current_mp": max_mp,
            "unspent_stat_points": 0,
        }).execute()

        character = insert_result.data[0]

        return self._build_response(character, cls)

    def get_character(self, session_player_id: str) -> dict:
        char_result = supabase.table("characters").select("*").eq("session_player_id", session_player_id).execute()

        if not char_result.data:
            raise ValueError("Character not found for this session player")

        character = char_result.data[0]

        class_result = supabase.table("classes").select("*").eq("id", character["class_id"]).execute()
        cls = class_result.data[0]

        return self._build_response(character, cls)

    def _build_response(self, character: dict, cls: dict) -> dict:
        level = character["level"]
        con_mod = _modifier(character["con"])
        wis_mod = _modifier(character["wis"])
        dex_mod = _modifier(character["dex"])

        max_hp = (cls["base_hp"] * level) + (con_mod * level)
        max_mp = (cls["base_mp"] * level) + (wis_mod * level)
        armor_class = 10 + dex_mod

        return {
            "id": character["id"],
            "session_player_id": character["session_player_id"],
            "class_id": character["class_id"],
            "class_name": cls["name"],
            "level": level,
            "exp": character["exp"],
            "str_stat": character["str"],
            "dex": character["dex"],
            "con": character["con"],
            "int_stat": character["int_stat"],
            "wis": character["wis"],
            "current_hp": character["current_hp"],
            "max_hp": max_hp,
            "current_mp": character["current_mp"],
            "max_mp": max_mp,
            "armor_class": armor_class,
            "unspent_stat_points": character["unspent_stat_points"],
        }


character_service = CharacterService()