# Development Roadmap

Asumsi: hackathon berdurasi terbatas (biasanya 24–72 jam) tapi struktur ini
disiapkan supaya lanjut jadi produk nyata. Roadmap dibagi jadi fase.

## Fase 0 — Setup (Hari ke-0, sebelum hackathon mulai)

- [ ] Semua anggota clone repo, jalankan `scripts/dev-setup.sh`
- [ ] Buat project Supabase, isi `.env` masing-masing service
- [ ] Install Ollama lokal, pull model (misal `llama3` atau model ringan lain)
- [ ] Pastikan `docker compose up` bisa jalan tanpa error (health check semua service)

## Fase 1 — Core Loop Playable (paling prioritas)

Tujuan: 1 loop penuh bisa dimainkan end-to-end walau semua konten masih dummy.

- [ ] Login/dummy auth → Create Session → Choose Character → masuk `/game`
- [ ] `BoardEngine` + `TileEngine` render grid statis
- [ ] `DiceEngine` + `MovementEngine` + `TurnEngine`: roll dice, jalan sesuai
      arah manual, gantian antar pemain
- [ ] Landing di tile event → trigger `EventEngine` → tampilkan `DialogueBox`
      dengan teks dummy (belum dari AI)
- [ ] `SaveEngine` dasar: simpan/lanjutkan sesi ke Supabase

## Fase 2 — Sambungkan AI

- [ ] `ai` service: endpoint `/article` mengembalikan artikel dummy dari
      RAG lokal (ingest beberapa dokumen contoh dulu)
- [ ] `fact_checker.py`: evaluasi jawaban sederhana (exact match dulu,
      baru upgrade ke LLM judge)
- [ ] Hubungkan `aiService.ts` (frontend) → `ai_gateway.py` (backend) → `ai/` service
- [ ] `npc_dialogue.py` + `narration.py` untuk mengisi story beats

## Fase 3 — Visual Novel Layer

- [ ] `StoryEngine` + `ChoiceEngine`: story graph sederhana dengan minimal
      2–3 percabangan
- [ ] Ganti placeholder UI `DialogueBox`/`ChoiceBox` dengan desain asli +
      sprite karakter + background
- [ ] `AnimationEngine`: transisi antar scene (fade, sprite masuk/keluar)

## Fase 4 — Polish untuk Demo

- [ ] `EndingEngine`: minimal 2 ending berbeda berdasarkan story flag
- [ ] HUD, MiniMap, Inventory diisi data asli
- [ ] PauseMenu, SaveMenu, LoadingScreen, Notification — UX polish
- [ ] Testing multi-pemain di 1 device (gantian giliran, tidak ada bug state
      "bocor" antar pemain)

## Fase 5 — Pasca-Hackathon (kalau lanjut jadi produk)

- [ ] Pindahkan dice roll & validasi turn ke server-authoritative
      (`backend/app/engines/turn_engine.py`, `dice_service.py`)
- [ ] Tambah real auth (bukan dummy), row-level security di Supabase
- [ ] Perbesar dataset RAG (artikel asli + hoax asli, sumber kredibel)
- [ ] Pertimbangkan WebSocket kalau mau expand ke multi-device
- [ ] Setup monitoring, rate limiting untuk AI gateway (biaya inference)

## Urutan Kerja Harian yang Disarankan (contoh 48 jam)

1. **Jam 0–6**: Fase 0 + kerangka Fase 1 (board render + movement, tanpa AI)
2. **Jam 6–16**: Selesaikan Fase 1 penuh (loop utuh, dice, turn, save)
3. **Jam 16–28**: Fase 2 (AI nyambung, walau kontennya masih sedikit)
4. **Jam 28–38**: Fase 3 (visual novel + story branching)
5. **Jam 38–46**: Fase 4 (polish, testing bareng 4 device/browser tab)
6. **Jam 46–48**: Buffer bug fixing + siapkan materi presentasi
