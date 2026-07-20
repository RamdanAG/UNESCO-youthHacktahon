# Placeholder repository layer - wraps Supabase table access per domain entity.

class UserRepository:
    def get_by_id(self, user_id: str):
        # TODO: query Supabase "users" table
        raise NotImplementedError


class SessionRepository:
    def get_by_id(self, session_id: str):
        # TODO: query Supabase "sessions" table
        raise NotImplementedError


class SaveGameRepository:
    def get_by_id(self, save_id: str):
        # TODO: query Supabase "saves" table
        raise NotImplementedError
