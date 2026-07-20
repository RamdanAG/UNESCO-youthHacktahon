# Architecture

## Prinsip Utama

1. **Clean Architecture** — logic game (engine) dipisah total dari UI (components)
   dan dari transport layer (API/services). Engine tidak tahu apa-apa soal React;
   komponen React tidak tahu detail internal engine, cuma manggil method publiknya.
2. **Single Page Game** — semua gameplay (board, dialog, choice, ending) hidup di
   satu route `/game`. Tidak ada `/game/chapter1`, `/game/chapter2`, dst. Perpindahan
   "scene" ditangani `SceneEngine` secara internal (state, bukan routing).
3. **AI sebagai Service, bukan Sutradara** — AI (Ollama + RAG) hanya dipanggil untuk
   tugas spesifik: generate artikel, cek jawaban, dialog NPC, narasi. Alur permainan
   (giliran, dice, movement, ending) tetap dikontrol oleh engine deterministik di
   frontend/backend, supaya game tetap predictable & fair, dan gampang di-debug saat
   hackathon.
4. **Server-Authoritative untuk hal kritis** — dice roll dan validasi giliran
   sebaiknya divalidasi ulang di backend (`backend/app/engines/turn_engine.py`,
   `backend/app/services/dice_service.py`) supaya 4 pemain di satu device tidak bisa
   saling curang lewat devtools. Untuk versi hackathon, boleh mulai dari client-side
   dulu (`DiceEngine.ts`) lalu pindahkan ke server saat waktu memungkinkan.

## Lapisan (Layers)

```
Frontend (Next.js)
 ├─ app/            → routing minimal (login, session, character, /game)
 ├─ components/      → UI murni, tidak ada game logic
 ├─ game-engine/      → SEMUA logic game, murni TypeScript (testable tanpa React)
 ├─ store/           → Zustand, state yang dibaca komponen & ditulis engine
 └─ services/        → HTTP client ke backend

Backend (FastAPI)
 ├─ api/v1/          → HTTP layer, tipis, cuma validasi request & panggil service
 ├─ services/         → business logic sesungguhnya
 ├─ engines/          → logic yang perlu server-authoritative (turn, dice)
 ├─ db/              → akses Supabase (repository pattern)
 └─ models/          → pydantic schema request/response

AI Service (FastAPI terpisah)
 ├─ rag/             → ingest dokumen, vector store, retriever
 ├─ generation/       → article generator, fact checker, NPC dialogue, narration
 └─ ollama_client.py → wrapper pemanggilan model lokal via Ollama
```

## Kenapa AI dipisah jadi service sendiri (bukan langsung di backend)?

- Supaya backend utama (FastAPI game logic) tetap ringan & cepat, tidak
  ke-block oleh inference LLM yang bisa lama.
- Gampang di-scale terpisah — kalau butuh GPU untuk Ollama, cukup service
  `ai/` yang di-deploy ke mesin ber-GPU, `backend/` tetap di mesin biasa.
- Batas tanggung jawab jelas untuk pembagian tim (lihat `TEAM_RESPONSIBILITY.md`).

## Alur Data Singkat (contoh: Player Lands on Event Tile)

1. `MovementEngine` (frontend) memvalidasi langkah, update `useBoardStore`.
2. `TileEngine` mendeteksi tile bertipe `event`, panggil `EventEngine.emit("tile:event")`.
3. Komponen yang subscribe (misal `DialogueBox`) bereaksi terhadap event.
4. `aiService.generateArticle()` → `backend /api/v1/ai/article` →
   `AIGatewayService` → forward ke `ai` service → `article_generator.py`
   (pakai `Retriever` dari RAG) → balik ke frontend.
5. `DialogueEngine`/`StoryEngine` menampilkan artikel & pertanyaan.
6. Pemain diskusi, submit jawaban → `aiService.checkAnswer()` → `fact_checker.py`.
7. Hasil dipakai `ChoiceEngine`/`StoryEngine` untuk update story flag →
   mempengaruhi `EndingEngine` di akhir game.

## Skalabilitas Pasca-Hackathon

- Tiap layer sudah independent (frontend/backend/ai terpisah container) →
  gampang di-scale horizontal masing-masing.
- `shared/contracts/` disiapkan sebagai tempat kontrak tipe yang bisa
  di-generate otomatis dari OpenAPI schema FastAPI, supaya frontend & backend
  tidak makin nge-drift saat project makin besar.
- Kalau nanti butuh real-time multiplayer lintas device (bukan cuma 1 device
  4 pemain), tinggal tambah WebSocket layer di backend tanpa mengubah struktur
  `game-engine/` di frontend (engine cukup terima event dari WebSocket, sama
  seperti terima event dari local input).
