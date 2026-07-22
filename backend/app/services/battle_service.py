import math

from app.db.supabase_client import supabase
from app.services.character_service import _modifier
from app.services.dice_utils import roll_dice, basic_attack_roll


class BattleService:
    def start_battle(self, session_id: str, enemy_name: str, enemy_ac: int, enemy_max_hp: int) -> dict:
        players = supabase.table("session_players").select("id").eq("session_id", session_id).order("turn_order").execute()

        if not players.data:
            raise ValueError("No players found in this session")

        character_ids = []
        for p in players.data:
            char = supabase.table("characters").select("id").eq("session_player_id", p["id"]).execute()
            if char.data:
                character_ids.append(char.data[0]["id"])

        if not character_ids:
            raise ValueError("No characters created yet for this session")

        result = supabase.table("battles").insert({
            "session_id": session_id,
            "status": "ongoing",
            "enemy_name": enemy_name,
            "enemy_ac": enemy_ac,
            "enemy_max_hp": enemy_max_hp,
            "enemy_current_hp": enemy_max_hp,
            "turn_order": character_ids,
            "current_turn_index": 0,
        }).execute()

        return result.data[0]

    def submit_action(self, battle_id: str, character_id: str, skill_id: str | None, target_type: str) -> dict:
        battle = self._get_battle(battle_id)

        if battle["status"] != "ongoing":
            raise ValueError("Battle is not ongoing")

        character = self._get_character(character_id)

        mp_cost = 0
        if skill_id:
            skill = self._get_skill(skill_id)
            mp_cost = skill["mp_cost"]

            if character["current_mp"] < mp_cost:
                raise ValueError(f"Not enough MP (need {mp_cost}, have {character['current_mp']})")

        difficulty = max(1, min(10, math.ceil((battle["enemy_ac"] - 8) / 3 + mp_cost / 4)))

        action_result = supabase.table("battle_actions").insert({
            "battle_id": battle_id,
            "character_id": character_id,
            "skill_id": skill_id,
            "target_type": target_type,
            "difficulty": difficulty,
        }).execute()

        if mp_cost > 0:
            supabase.table("characters").update({
                "current_mp": character["current_mp"] - mp_cost
            }).eq("id", character_id).execute()

        return {
            "action_id": action_result.data[0]["id"],
            "difficulty": difficulty,
            "skill_id": skill_id,
            "mp_cost": mp_cost,
        }

    def resolve_action(self, action_id: str, is_correct: bool) -> dict:
        action = supabase.table("battle_actions").select("*").eq("id", action_id).execute()
        if not action.data:
            raise ValueError("Action not found")
        action = action.data[0]

        battle = self._get_battle(action["battle_id"])
        character = self._get_character(action["character_id"])
        class_data = supabase.table("classes").select("*").eq("id", character["class_id"]).execute().data[0]

        modifiers = {
            "str": _modifier(character["str"]),
            "dex": _modifier(character["dex"]),
            "con": _modifier(character["con"]),
            "int": _modifier(character["int_stat"]),
            "wis": _modifier(character["wis"]),
        }

        damage = 0
        is_hit = is_correct

        if is_correct and action["target_type"] == "enemy":
            if action["skill_id"]:
                skill = self._get_skill(action["skill_id"])
                if "Attk" in skill["tags"]:
                    damage = roll_dice(skill["dice_formula"], modifiers)
            else:
                damage = basic_attack_roll(modifiers)

        new_enemy_hp = max(battle["enemy_current_hp"] - damage, 0)
        new_status = "won" if new_enemy_hp <= 0 else "ongoing"

        turn_order = battle["turn_order"]
        new_turn_index = (battle["current_turn_index"] + 1) % len(turn_order)
        next_turn_character_id = turn_order[new_turn_index] if new_status == "ongoing" else None

        supabase.table("battle_actions").update({
            "is_correct": is_correct,
            "is_hit": is_hit,
            "damage_dealt": damage,
        }).eq("id", action_id).execute()

        update_payload = {
            "enemy_current_hp": new_enemy_hp,
            "current_turn_index": new_turn_index,
            "status": new_status,
        }
        if new_status == "won":
            update_payload["ended_at"] = "now()"
        supabase.table("battles").update(update_payload).eq("id", action["battle_id"]).execute()

        updated_character = self._get_character(action["character_id"])

        return {
            "action_id": action_id,
            "is_correct": is_correct,
            "is_hit": is_hit,
            "damage_dealt": damage,
            "enemy_current_hp": new_enemy_hp,
            "character_current_mp": updated_character["current_mp"],
            "battle_status": new_status,
            "next_turn_character_id": next_turn_character_id,
        }

    def _get_battle(self, battle_id: str) -> dict:
        result = supabase.table("battles").select("*").eq("id", battle_id).execute()
        if not result.data:
            raise ValueError("Battle not found")
        return result.data[0]

    def _get_character(self, character_id: str) -> dict:
        result = supabase.table("characters").select("*").eq("id", character_id).execute()
        if not result.data:
            raise ValueError("Character not found")
        return result.data[0]

    def _get_skill(self, skill_id: str) -> dict:
        result = supabase.table("skills").select("*").eq("id", skill_id).execute()
        if not result.data:
            raise ValueError(f"Skill {skill_id} not found")
        return result.data[0]


battle_service = BattleService()