# Backend Contract — Status, Batas Tanggung Jawab, dan Aturan Integrasi

Dokumen ini adalah **sumber kebenaran (source of truth)** tentang apa yang
sudah dibangun di Backend, bagaimana Frontend harus mengonsumsinya, dan
bagaimana AI service harus disambungkan. Tujuannya supaya 3 role (Backend,
Frontend, AI) bisa kerja paralel tanpa saling nunggu dan tanpa saling
tabrakan asumsi.

**Aturan dasar:** kalau ada yang mau mengubah bentuk request/response yang
sudah tertulis di sini, WAJIB update dokumen ini dulu dan infokan ke 2 role
lain sebelum ubah kode. Jangan langsung ubah endpoint tanpa update kontrak.

---

## 1. Status Saat Ini (per hari ini)

| Bagian | Status | Catatan |
|---|---|---|
| Database (13 tabel Supabase) | ✅ Selesai | Lihat Bagian 5, file `database/schema.sql` |
| Auth (`register`, `login`) | ✅ Selesai & teruji | Pakai Supabase Auth bawaan |
| Session (`create`, `join`) | ✅ Selesai & teruji | Room max 4 pemain |
| Character (`POST /player/character`, `GET /player/{id}`) | ✅ Selesai & teruji | Hitung formula GDD (max HP/MP/AC) on-the-fly |
| Battle Tahap 1 (`/battle/start`, `/action`, `/action/{id}/resolve`) | ✅ Selesai & teruji | Belum ada efek status (stun/DOT) — itu Tahap 2, belum dikerjakan |
| Story flags (`/story/flag`, `/story/{id}`) | ✅ Selesai & teruji | |
| Save/Load (`/save`, `/save/{id}`) | ✅ Selesai & teruji | Ambil save terbaru saja (belum ada pilih checkpoint tertentu) |
| Dice roll (`/dice/roll`) | ✅ Selesai & teruji | Utilitas generik 1-`sides`; **TIDAK dipakai untuk movement** — lihat catatan di bawah |
| AI Gateway (`/api/v1/ai/*`) | ✅ Gateway selesai, nunggu AI service | Forward ke `http://localhost:8001`, akan `502` sampai AI service jalan |
| Session move/movement | ❌ Belum | Endpoint ada, masih placeholder — menunggu Frontend `MovementEngine`, lihat catatan movement di bawah |
| Inventory | ❌ Sengaja tidak dikerjakan | GDD tidak mendefinisikan sistem item — tabel `inventory_items` tetap ada di database untuk kemungkinan pemakaian nanti, tapi service/endpoint dibiarkan placeholder sampai ada keputusan desain |
| Dialogue & Ending | ❌ Sengaja tidak dikerjakan | Konten dialog & percabangan ending ditulis manual sebagai data statis di Frontend, bukan dari database — cukup pakai `/story/flag` untuk simpan pilihan yang menentukan ending mana yang dipilih Frontend |

**Catatan penting soal movement (revisi dari draft GDD awal):** movement
BUKAN berdasarkan hasil dice. Tiap giliran, karakter pemain punya jatah
gerak tetap **4 kotak**, musuh **6 kotak** — konstan untuk semua kelas/level,
tidak disimpan di database. Jatah ini boleh dipecah ke beberapa arah dalam
1 giliran (misal kanan 2 + bawah 2 = 4). Detail lengkap & alasan ada di
`docs/WORK_BREAKDOWN.md` Bagian A.2 — WAJIB dibaca sebelum membangun
`MovementEngine` di Frontend.

**Penting untuk Frontend & AI dev:** jangan asumsikan endpoint yang statusnya
❌ di atas sudah berperilaku sesuai desain akhir. Semua endpoint itu ADA
(nggak 404) tapi masih balikin `{"message": "Coming Soon"}` — aman dipanggil
buat testing UI/wiring, tapi datanya belum nyata.

---

## 2. Prinsip Arsitektur (WAJIB dipahami sebelum baca lebih lanjut)

1. **Backend adalah satu-satunya pintu ke database.** Frontend TIDAK BOLEH
   memanggil Supabase langsung dari browser untuk data gameplay (sessions,
   characters, battles, dll). Semua lewat REST API backend
   (`http://localhost:8000/api/v1/...`).
   - Pengecualian: Supabase Auth session token yang didapat dari
     `login`/`register` boleh disimpan di Frontend (localStorage/state) untuk
     dipakai sebagai identitas — tapi query datanya tetap lewat backend.
2. **Backend adalah satu-satunya pintu ke AI service.** AI service (`ai/`)
   TIDAK diakses langsung oleh Frontend. Alurnya selalu:
   `Frontend → Backend (/api/v1/ai/*) → AI service (port 8001) → balik lagi`.
3. **Formula/rumus game (difficulty, damage, modifier stat) hidup di
   Backend**, bukan di Frontend maupun AI service. Frontend hanya
   menampilkan hasil yang dikirim Backend. AI service hanya menerima angka
   `difficulty` yang sudah dihitung Backend — AI TIDAK menghitung difficulty
   sendiri.
4. **Mode MVP saat ini: tidak ada validasi token di tiap request.**
   Endpoint menerima `player_id`/`host_id` langsung di body request (bukan
   dari header `Authorization`). Ini keputusan sadar untuk mempercepat
   development hackathon — lihat Bagian 6 untuk detail risiko & rencana
   upgrade.

---

## 3. Kontrak untuk Frontend

### 3.1 Base URL
```
http://localhost:8000/api/v1
```
(ganti ke domain production nanti via `NEXT_PUBLIC_BACKEND_URL` di
`frontend/.env.local`, jangan hardcode)

### 3.2 Endpoint yang SUDAH bisa diintegrasikan sekarang

**POST `/auth/register`**
```json
// Request
{ "email": "string", "password": "string", "display_name": "string" }
// Response 200
{ "access_token": "string", "refresh_token": "string", "user_id": "string", "display_name": "string" }
// Response 400 kalau gagal (email sudah dipakai, dll)
{ "detail": "string" }
```

**POST `/auth/login`**
```json
// Request
{ "email": "string", "password": "string" }
// Response 200 — bentuk sama persis dengan register
{ "access_token": "string", "refresh_token": "string", "user_id": "string", "display_name": "string" }
// Response 401 kalau salah
{ "detail": "string" }
```
Frontend WAJIB simpan `user_id` — ini dipakai sebagai `host_id`/`player_id`
di semua endpoint session & character selanjutnya.

**POST `/session/create`**
```json
// Request
{ "host_id": "string (uuid dari user_id)", "display_name": "string" }
// Response 200
{
  "id": "string (uuid)",
  "join_code": "string (5 karakter)",
  "status": "waiting",
  "host_id": "string",
  "players": [
    { "id": "string", "player_id": "string", "display_name": "string", "turn_order": 0 }
  ]
}
```

**POST `/session/join`**
```json
// Request
{ "join_code": "string", "player_id": "string (uuid)", "display_name": "string" }
// Response 200 — bentuk sama dengan create, players berisi semua pemain
// Response 400 kalau: session tidak ditemukan, session penuh (4 pemain),
//   session sudah tidak status "waiting", atau player sudah join sebelumnya
{ "detail": "string" }
```

### 3.3 Endpoint yang BELUM final (jangan bangun UI final di atasnya dulu)

Semua endpoint di bawah ini bisa dipanggil (tidak 404) tapi masih
placeholder — aman untuk wiring awal/skeleton, tapi bentuk request/response
FINAL-nya BELUM ditentukan dan BISA BERUBAH:

- `POST /session/move`
- `GET/POST /player/*`
- `GET/POST /story/*`
- `GET/POST /dialogue/*`
- `POST /dice/roll`
- `GET/POST /inventory/*`
- `GET /ending/{session_id}`
- `POST /ai/*`

Kalau Frontend butuh salah satu dari ini lebih cepat dari rencana, **infokan
ke Backend dev dulu** (bukan asumsi sendiri bentuk response-nya), supaya
kontrak di dokumen ini diupdate bareng-bareng.

### 3.4 Yang BOLEH ditambahkan Frontend secara independen (tanpa nunggu Backend)

- Semua isi `game-engine/` (BoardEngine, DiceEngine visual/animasi,
  MovementEngine untuk pergerakan LOKAL sementara sebelum di-submit ke
  server, SceneEngine, AnimationEngine, dll) — ini murni logic sisi client
  untuk UX, boleh dikembangkan bebas.
- Semua komponen UI (`components/game/*`, `components/ui/*`) — styling,
  layout, animasi, transisi.
- State management tambahan di `store/` (Zustand) untuk kebutuhan UI (misal
  `useUIStore` untuk modal/toast) — selama tidak menyimpan data yang
  seharusnya jadi sumber kebenaran server (misal HP karakter, hasil dice
  resmi).
- Mock/dummy data untuk endpoint yang belum final (Bagian 3.3), ASALKAN
  bentuknya mengikuti draft di dokumen ini, dan gampang diganti ke real
  fetch nanti (taruh di 1 tempat, misal flag `USE_MOCK_DATA` di
  `services/`).

### 3.5 Yang TIDAK BOLEH dilakukan Frontend

- **Jangan hitung ulang formula game di Frontend** (max HP, max MP, Armor
  Class, Difficulty AI, damage) untuk keperluan APAPUN selain preview
  visual sementara. Nilai yang dianggap resmi/final SELALU dari respons
  Backend. Kalau Frontend menghitung sendiri lalu berbeda dengan Backend,
  Backend yang benar.
- **Jangan simpan hasil dice roll, damage, atau HP sebagai sumber
  kebenaran di client state** melewati 1 sesi combat — begitu ada
  response dari server (`/dice/roll`, `/api/v1/battle/*` nanti), state
  lokal harus disinkronkan ulang ke nilai server, bukan sebaliknya.
- **Jangan panggil Supabase langsung** dari `frontend/src/lib/supabaseClient.ts`
  untuk data gameplay. File itu boleh ada untuk keperluan lain (misal kalau
  nanti butuh Supabase Realtime buat sinkronisasi multiplayer ringan), tapi
  BUKAN untuk baca/tulis tabel seperti `characters`, `battles`, `sessions`
  langsung dari browser.
- **Jangan hardcode `join_code` format atau panjangnya** di validasi
  Frontend (misal asumsi selalu 5 karakter uppercase+digit) — perlakukan
  sebagai string bebas dari server, karena format generatornya bisa berubah
  di Backend tanpa broadcast ke Frontend selama tetap `unique`.

---

## 4. Kontrak untuk AI Service

### 4.1 Prinsip Utama
AI service (`ai/`, port 8001) **tidak pernah dipanggil langsung oleh
Frontend**. AI service juga **tidak pernah membaca/menulis ke Supabase**
punya Backend — AI service hanya boleh punya vector store sendiri (untuk
RAG) yang terpisah dari database utama game.

Alurnya:
```
Frontend → Backend (/api/v1/ai/article, /check-answer, dst)
         → Backend forward request ke AI service (http://ai:8001 atau
           OLLAMA_HOST tergantung konfigurasi)
         → AI service balikin hasil
         → Backend balikin ke Frontend (boleh diproses dulu, misal
           digabung dengan data battle)
```

### 4.2 Endpoint yang Backend HARAPKAN dari AI service

Ini kontrak yang perlu disepakati bareng AI dev sebelum ai_gateway_service.py
diisi beneran. Draft bentuknya (BISA didiskusikan ulang, tapi begitu fix
harus konsisten):

**POST `/article`** (AI service, port 8001)
```json
// Request
{ "topic": "string", "difficulty": "int (1-10, dari formula Backend)" }
// Response
{ "title": "string", "body": "string", "is_hoax": "boolean" }
```

**POST `/check-answer`**
```json
// Request
{ "question_id": "string", "answer": "string" }
// Response
{ "correct": "boolean", "explanation": "string" }
```

**POST `/npc-dialogue`**
```json
// Request
{ "npc_id": "string", "context": "string" }
// Response
{ "npc_id": "string", "line": "string" }
```

**POST `/narration`**
```json
// Request
{ "scene_id": "string" }
// Response
{ "scene_id": "string", "narration": "string" }
```

### 4.3 Formula Difficulty — WAJIB dipahami AI dev

Sesuai GDD, tingkat kesulitan pertanyaan (`D`, skala 1-10) dihitung dengan:

```
D = min(10, ceil((enemy_AC - 8) / 3 + skill_MP / 4))
```

**Formula ini DIHITUNG DI BACKEND**, bukan di AI service. AI service HANYA
MENERIMA nilai `difficulty` yang sudah jadi (1-10) sebagai parameter, lalu
tugas AI adalah membuat pertanyaan/artikel yang levelnya SESUAI dengan angka
itu (soal makin susah dari kompleksitas topik, panjang bacaan, atau
ambiguitas fakta vs hoax — AI dev yang menentukan cara menerjemahkan angka
1-10 ke tingkat kesulitan konten).

**AI service TIDAK BOLEH:**
- Menghitung ulang formula `D` dari `AC`/`MP` — itu bukan tanggung jawabnya,
  dan `AC`/`MP` karakter/musuh bahkan tidak boleh diakses langsung oleh AI
  service (AI service tidak tahu apa-apa soal stat combat).
- Mengakses tabel Supabase manapun milik Backend.
- Menyimpan hasil generate (artikel, pertanyaan) sebagai sumber kebenaran
  permanen — kalau butuh riwayat pertanyaan yang pernah dijawab, itu
  disimpan Backend di tabel `battle_actions` (kolom `question_id`), bukan
  di sisi AI service.

### 4.4 Yang BOLEH dikembangkan AI Service secara independen

- Seluruh isi `ai/app/rag/` — pipeline ingest dokumen, vector store,
  retriever. AI dev bebas eksperimen dengan model embedding, chunking
  strategy, dsb, selama endpoint publiknya (Bagian 4.2) tetap konsisten
  bentuknya.
- Dataset artikel asli/hoax untuk RAG — kurasi & tambah sumber kapan saja.
- Prompt engineering di `ai/app/generation/*.py` — tuning gaya bahasa,
  panjang artikel, dst.
- Testing AI service secara mandiri lewat `http://localhost:8001/docs`
  tanpa perlu Backend atau Frontend jalan sama sekali.

### 4.5 Yang TIDAK BOLEH dilakukan AI Service

- Jangan generate keputusan gameplay (menang/kalah, damage, HP berkurang
  berapa) — itu murni kalkulasi Backend berdasarkan `is_correct` yang
  dikembalikan AI. AI cuma bilang benar/salah + penjelasan, bukan
  "musuh kehilangan 15 HP".
- Jangan mengembalikan skor kesulitan sendiri yang beda dari yang diminta
  Backend (`difficulty` di request wajib diikuti, bukan dihitung ulang
  berdasarkan asumsi AI sendiri).

---

## 5. Ringkasan Skema Database (referensi cepat)

Detail lengkap kolom ada langsung di Supabase (Table Editor). Ringkasan
relasi untuk konteks integrasi:

```
profiles (dari Supabase Auth)
  └─ sessions (host_id → profiles.id)
       └─ session_players (session_id, player_id → profiles.id)
            ├─ characters (session_player_id, class_id → classes.id)
            │    └─ character_skills (character_id, skill_id → skills.id)
            └─ inventory_items (session_player_id)
       ├─ story_flags (session_id)
       ├─ saves (session_id, saved_by → profiles.id)
       └─ battles (session_id)
            └─ battle_actions (battle_id, character_id, skill_id)

classes (statis, 4 baris: Wizard/Priestess/Rogue/Fighter)
skills (statis, 68 baris: 17 skill × 4 kelas)
level_rewards (statis, 10 baris: reward per level 1-10)
```

**Data statis (`classes`, `skills`, `level_rewards`) sudah final** — semua
angka sudah dikoreksi supaya sesuai aturan GDD (55 poin distribusi stat,
40 poin HP+MP seimbang). Frontend/AI TIDAK perlu — dan TIDAK BOLEH — punya
salinan data ini sendiri (misal hardcode daftar skill di frontend); selalu
fetch dari Backend supaya kalau ada balancing/tweak, cukup ubah di satu
tempat (database).

---

## 6. Keputusan Sadar untuk MVP (dan Risikonya)

| Keputusan | Alasan MVP | Risiko | Rencana ke depan |
|---|---|---|---|
| `player_id`/`host_id` dikirim manual di body, tidak divalidasi dari token | Lebih cepat coding, cukup untuk demo hackathon | Siapapun bisa klaim jadi player lain kalau tau UUID-nya | Ganti ke `Authorization: Bearer <token>` + endpoint `get_current_user()` sebelum production |
| RLS di `sessions`/`session_players`/`profiles` dibuka lebar (`using (true)`) untuk backend, policy SELECT terbatas untuk `profiles` | Supabase Auth token yang dipakai `supabase-py` otomatis switch dari service_role ke token user, menyebabkan block RLS kalau policy ketat | Kalau `anon key` bocor, orang bisa baca/tulis tabel langsung by-pass backend | Pertimbangkan pisah 2 Supabase client (1 pure service_role tanpa pernah panggil `.auth`, 1 khusus auth) |
| Dice roll masih rencana di client (`DiceEngine.ts`) dulu | Cepat untuk prototyping loop dasar | Pemain bisa curang lewat devtools browser | Pindahkan ke `dice_service.py` (server-authoritative) sebelum dipakai kompetitif/production, sesuai catatan di `ARCHITECTURE.md` |

Dokumen ini akan terus diupdate seiring service baru selesai (character,
battle, story, save, AI gateway) — cek bagian **Status Saat Ini** di atas
tiap mau mulai kerja fitur baru biar tau mana yang udah bisa diandalkan.