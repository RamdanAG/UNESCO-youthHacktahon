# Naming Convention

## Files & Folders

| Jenis | Konvensi | Contoh |
|---|---|---|
| React component | PascalCase | `DialogueBox.tsx` |
| Engine class (TS) | PascalCase + suffix `Engine` | `TurnEngine.ts` |
| Zustand store | camelCase, prefix `use` | `useBoardStore.ts` |
| Service (frontend) | camelCase, suffix `Service` | `aiService.ts` |
| Python module/file | snake_case | `dice_service.py` |
| Python class | PascalCase | `class DiceService` |
| Folder | kebab-case atau snake_case (konsisten per layer: TS = kebab, Python = snake) | `game-engine/`, `api/v1/` |

## Variabel & Fungsi

- TypeScript: `camelCase` untuk variabel & fungsi, `PascalCase` untuk
  class/type/interface, `UPPER_SNAKE_CASE` untuk konstanta global
  (`MAX_PLAYERS`).
- Python: `snake_case` untuk variabel/fungsi, `PascalCase` untuk class,
  `UPPER_SNAKE_CASE` untuk konstanta.

## API Endpoint

- Selalu di bawah prefix `/api/v1/<domain>` (contoh: `/api/v1/dice/roll`).
- Path segment pakai kebab-case kalau lebih dari 1 kata
  (`/check-answer`, bukan `/checkAnswer` atau `/check_answer`).

## Story / Event Naming (khusus game-engine)

- Event name di `EventEngine` pakai format `domain:action`, contoh:
  `tile:event`, `dice:rolled`, `turn:next`, `story:choice-made`,
  `ending:resolved`.
- Story flag key pakai `snake_case`, deskriptif, contoh:
  `helped_npc_reporter`, `chose_hoax_answer_ch1`.
