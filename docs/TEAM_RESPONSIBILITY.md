# Team Responsibility

> Versi ini disesuaikan untuk tim **3 orang**: Frontend, Backend, AI.
> Pembagian berbasis BATAS FOLDER supaya kerja paralel minim tabrakan file.

## Ringkasan Pembagian

| Role | Folder utama | Kerja paling independen? |
|---|---|---|
| Frontend | `frontend/**` (game-engine + components + app) | Tidak — butuh kontrak API dari Backend |
| **Backend** | `backend/**` | Sedang — butuh kontrak dari AI utk gateway, tapi auth/session/save bisa mulai sendiri |
| AI | `ai/**` | Paling independen — bisa jalan & tes sendiri dari hari 1 |

Karena cuma 3 orang, Frontend otomatis merangkap **Game Engine Lead** sekaligus
**UI/Visual Novel Engineer** (`game-engine/` dan `components/` sama-sama
tanggung jawabnya). Kalau ada waktu luang, siapapun boleh bantu isi
`docs/` atau naskah cerita — itu bukan punya siapa-siapa secara eksklusif.

---

## 🧩 Backend Engineer (kamu)

**Folder:** `backend/**`

### Tanggung jawab per file/folder

- `api/v1/*.py` — HTTP layer tipis: auth, session, player, story, dialogue,
  dice, inventory, ending, **ai_gateway** (ini titik sambung ke AI dev).
- `services/*.py` — business logic sesungguhnya di balik tiap endpoint.
- `db/supabase_client.py` + `db/repositories.py` — skema & akses Supabase
  (users, sessions/rooms, players, story_flags, saves).
- `engines/turn_engine.py` — validasi giliran server-side, biar 4 pemain
  1 device nggak bisa curang lewat devtools (gantian dice/movement harus
  divalidasi ulang di sini, bukan cuma percaya client).
- `core/config.py`, `core/security.py` — env config & auth/JWT.

### Yang perlu disepakati duluan sama 2 role lain (taruh di `shared/contracts/`)

1. **Sama AI dev**: bentuk request/response `ai_gateway.py` ke service `ai/`
   — misal `POST /article {topic}` → `{title, body, is_hoax}`,
   `POST /check-answer {question_id, answer}` → `{correct, explanation}`.
   Begitu ini fix, kamu bisa balikin dummy response dulu tanpa nunggu AI
   servicenya jadi.
2. **Sama Frontend**: bentuk response tiap endpoint yang mereka konsumsi
   (session create/join, dice roll, save/load, dst). Frontend bisa mock
   dari kontrak ini sambil kamu ngerjain backend beneran.

### Urutan kerja yang disaranin (independen dari 2 role lain di awal)

1. **Supabase schema dulu** — bikin tabel `users`, `sessions`, `players`,
   `story_flags`, `saves` sebelum nulis service, biar bentuk data jelas dari
   awal (dan bisa langsung dipakai jadi acuan kontrak ke Frontend).
2. `auth_service.py` + endpoint `auth.py` — boleh mulai dari dummy/simple
   auth dulu (email+password tanpa hashing canggih) biar cepat ada yang bisa
   dites, upgrade keamanannya belakangan.
3. `session_service.py` + endpoint `session.py` — create/join room, simpan
   daftar player per sesi.
4. `dice_service.py` + `engines/turn_engine.py` — roll dice & validasi
   giliran server-side.
5. `save_service.py` — save/load snapshot game state.
6. `ai_gateway_service.py` + endpoint `ai_gateway.py` — di awal cukup
   forward ke response dummy sesuai kontrak, ganti ke pemanggilan `ai/`
   service asli begitu AI dev sudah punya endpoint jalan.

---

## 🎨 Frontend Engineer

**Folder:** `frontend/**` (merangkap `game-engine/` + `components/` + `app/`)

- Core loop: `BoardEngine`, `TileEngine`, `MovementEngine`, `DiceEngine`,
  `TurnEngine` — render grid, roll dice, jalan manual, gantian giliran.
- Visual novel: `StoryEngine`, `DialogueEngine`, `ChoiceEngine`,
  `EndingEngine` + komponen `DialogueBox`/`ChoiceBox`.
- `services/*.ts` manggil endpoint kamu (Backend) — di awal boleh mock
  sesuai kontrak yang udah disepakati, ganti ke fetch beneran belakangan.
- Styling/HUD/MiniMap/Inventory/PauseMenu/dll — presentation layer, tidak
  boleh ada game logic di sini (logic tetap di `game-engine/`).

## 🤖 AI Engineer

**Folder:** `ai/**`

- RAG: `rag/ingest.py`, `rag/vector_store.py`, `rag/retriever.py` —
  kumpulkan & index dataset artikel asli/hoax.
- Generation: `article_generator.py`, `fact_checker.py`,
  `npc_dialogue.py`, `narration.py`.
- Bisa kerja paling independen — jalankan & tes `ai/` service sendiri
  (`uvicorn app.main:app --port 8001`) tanpa nunggu backend/frontend, asal
  bentuk response udah sesuai kontrak yang disepakati sama kamu (Backend).

---

## Aturan Kolaborasi

- 1 orang = 1 folder utama sebagai "pemilik", boleh baca folder lain tapi
  perubahan besar di folder orang lain dikoordinasikan dulu.
- Perubahan bentuk request/response API wajib update dulu di
  `shared/contracts/` sebelum dikerjakan, supaya 3 role ini nggak saling
  nunggu atau tabrakan asumsi.
- Karena tim kecil (3 orang), sinkronisasi cukup singkat tiap beberapa jam
  (bukan meeting formal) — cukup update di grup chat: "endpoint X udah
  jalan, bentuknya begini".
