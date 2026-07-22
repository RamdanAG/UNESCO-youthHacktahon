import random


class DiceService:
    def roll(self, sides: int = 6) -> int:
        return random.randint(1, sides)


dice_service = DiceService()