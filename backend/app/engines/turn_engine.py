# Server-side mirror of frontend TurnEngine, used to validate turn order
# authoritatively and prevent out-of-turn actions.

class TurnEngine:
    def next_turn(self, current_player_id: str, player_order: list) -> str:
        # TODO: implement rotation logic
        raise NotImplementedError
