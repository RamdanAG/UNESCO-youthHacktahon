from app.db.supabase_client import supabase


class StoryService:
    def set_flag(self, session_id: str, flag_key: str, flag_value: str) -> dict:
        # upsert: kalau flag_key sudah ada untuk session ini, update;
        # kalau belum, insert baru (sesuai constraint unique(session_id, flag_key))
        supabase.table("story_flags").upsert({
            "session_id": session_id,
            "flag_key": flag_key,
            "flag_value": flag_value,
        }, on_conflict="session_id,flag_key").execute()

        return {"flag_key": flag_key, "flag_value": flag_value}

    def get_story_state(self, session_id: str) -> dict:
        session = supabase.table("sessions").select("current_scene_id").eq("id", session_id).execute()
        if not session.data:
            raise ValueError("Session not found")

        flags = supabase.table("story_flags").select("flag_key, flag_value").eq("session_id", session_id).execute()

        return {
            "session_id": session_id,
            "current_scene_id": session.data[0]["current_scene_id"],
            "flags": flags.data,
        }


story_service = StoryService()