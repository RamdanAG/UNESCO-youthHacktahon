from app.db.supabase_client import supabase


class SaveService:
    def save_game(self, session_id: str, saved_by: str, snapshot: dict) -> dict:
        result = supabase.table("saves").insert({
            "session_id": session_id,
            "saved_by": saved_by,
            "snapshot": snapshot,
        }).execute()

        return result.data[0]

    def load_game(self, session_id: str) -> dict:
        # ambil save TERBARU untuk sesi ini (checkpoint terakhir)
        result = (
            supabase.table("saves")
            .select("*")
            .eq("session_id", session_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not result.data:
            raise ValueError("No save found for this session")

        return result.data[0]


save_service = SaveService()