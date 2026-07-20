# Coding Convention

## TypeScript / React (frontend)

- Setiap engine di `game-engine/` adalah `class`, diekspor sebagai named
  export + default export, minimal punya `init/start/pause/resume/stop`
  kalau relevan dengan siklus hidup game.
- Komponen React: functional component, default export, satu komponen per
  file, nama file = nama komponen (PascalCase).
- Jangan taruh `fetch`/`axios` langsung di komponen — selalu lewat
  `services/*Service.ts`.
- State yang perlu dibaca banyak komponen → taruh di `store/` (Zustand),
  jangan lifting props manual berlapis-lapis.
- Gunakan `@/` alias (bukan relative path panjang `../../../`) untuk import
  dari `src/`.

## Python (backend & ai)

- Endpoint di `api/v1/*.py` harus tipis: validasi request → panggil
  `services/*.py` → return response. Jangan taruh business logic di file
  endpoint.
- Semua service adalah `class` dengan method yang jelas namanya (verb +
  noun, misal `create_session`, bukan `do_session`).
- Gunakan pydantic model (`models/schemas.py`) untuk semua request/response
  body, jangan pakai `dict` mentah di signature endpoint publik.
- Ikuti PEP 8. Format dengan `black`, lint dengan `ruff` (tambahkan ke
  `requirements.txt` masing-masing service saat mulai dipakai).

## Umum

- Tidak ada file kosong / komentar `// TODO` tanpa penjelasan singkat apa
  yang perlu diisi.
- Setiap fungsi placeholder yang belum diimplementasi sebaiknya
  `raise NotImplementedError("...")` (Python) atau komentar `// TODO:`
  yang jelas (TypeScript) — supaya gampang di-grep saat mau lanjut kerja.
- Hindari over-engineering di awal — ikuti fase di `DEVELOPMENT_FLOW.md`,
  jangan bikin abstraksi baru sebelum ada 2+ kebutuhan nyata yang butuh itu.
