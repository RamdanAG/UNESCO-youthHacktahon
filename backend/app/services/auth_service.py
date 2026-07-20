from app.db.supabase_client import supabase


class AuthService:
    def register(self, email: str, password: str, display_name: str) -> dict:
        result = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {"display_name": display_name}
            }
        })

        if result.user is None or result.session is None:
            raise ValueError("Registration failed - check email confirmation settings")

        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user_id": result.user.id,
            "display_name": display_name,
        }

    def login(self, email: str, password: str) -> dict:
        result = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })

        if result.user is None or result.session is None:
            raise ValueError("Invalid email or password")

        profile_query = supabase.table("profiles").select("display_name").eq("id", result.user.id).execute()

        if not profile_query.data:
            raise ValueError(f"Profile not found for user {result.user.id}")

        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user_id": result.user.id,
            "display_name": profile_query.data[0]["display_name"],
        }


auth_service = AuthService()