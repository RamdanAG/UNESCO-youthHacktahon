import random
import re


def roll_dice(formula: str | None, modifiers: dict) -> int:
    """
    Parse & hitung formula dari kolom skills.dice_formula, misal:
    "3d6 + Int bonus", "1d20 + Wisdom bonus", "2 + Int bonus", "1d6".

    modifiers: dict modifier stat yang sudah dihitung, misal
      {"str": 1, "dex": 2, "con": 0, "int": 3, "wis": 2}

    Return total damage. Return 0 kalau formula None atau tidak ada
    angka/dice yang bisa di-parse (misal efek buff murni "x2 Int modifier").
    """
    if not formula:
        return 0

    total = 0

    # Notasi dice NdM, misal "3d6"
    dice_match = re.search(r'(\d+)d(\d+)', formula)
    if dice_match:
        count, sides = int(dice_match.group(1)), int(dice_match.group(2))
        total += sum(random.randint(1, sides) for _ in range(count))
    else:
        # fallback: angka flat di depan, misal "2 + Int bonus"
        flat_match = re.match(r'^\D*(\d+)', formula)
        if flat_match:
            total += int(flat_match.group(1))

    # bonus stat, misal "+ Int bonus" / "+ Wisdom bonus"
    stat_keywords = {
        "strength": "str", "str": "str",
        "dexterity": "dex", "dex": "dex",
        "constitution": "con", "con": "con",
        "intelligence": "int", "int": "int",
        "wisdom": "wis", "wis": "wis",
    }
    formula_lower = formula.lower()
    if "bonus" in formula_lower:
        for keyword, stat_key in stat_keywords.items():
            if keyword in formula_lower:
                total += modifiers.get(stat_key, 0)
                break

    return max(total, 0)


def basic_attack_roll(modifiers: dict) -> int:
    """
    Default damage Basic Attack untuk MVP (GDD tidak mendefinisikan ini
    secara eksplisit, hanya formula difficulty-nya). Pakai baseline
    1d6 + STR modifier. Ubah di sini kalau desain game menentukan lain.
    """
    return max(random.randint(1, 6) + modifiers.get("str", 0), 0)