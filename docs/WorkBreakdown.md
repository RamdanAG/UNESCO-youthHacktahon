# Work Breakdown — Frontend & AI (Detail Konkret)

Dokumen ini melengkapi `BACKEND_CONTRACT.md`. Kalau file itu jawab
"bentuk data & batasannya apa", file ini jawab **"harus bangun apa aja,
urutannya gimana, dan seberapa bagus itu harus jadi di tahap ini"**.

## Filosofi: "Good Enough Software"

Untuk hackathon, target kita BUKAN kode paling elegan atau fitur paling
lengkap — target-nya adalah **loop permainan utuh yang bisa dimainkan dari
awal sampai akhir**, walau sebagian kontennya masih sederhana. Konsekuensi
dari filosofi ini:

- **Boleh hardcode sementara** kalau itu bukan bagian inti yang dinilai
  (misal: 1 background statis dulu buat semua scene, baru nanti ditambah
  variasi). Yang TIDAK boleh di-hardcode: data yang seharusnya dari
  Backend (stat karakter, skill list, hasil combat) — itu beda kasus,
  lihat `BACKEND_CONTRACT.md` Bagian 3.5/4.5.
- **Selesaikan versi kasar dulu, baru dipercantik.** Jangan habiskan waktu
  polish animasi transisi sebelum loop dasarnya (Menu → Battle → Ending)
  bisa dimainkan ujung ke ujung, walau tampilannya masih kotak-kotak polos.
- **Perubahan itu wajar dan boleh terjadi.** Dokumen ini kasih urutan &
  target yang masuk akal, tapi kalau di tengah jalan ternyata ada yang
  perlu diubah (misal desain UI ternyata lebih enak beda dari draft), itu
  normal — bukan berarti dokumennya salah. Prioritaskan kerja jalan
  terus daripada nunggu dokumen "sempurna" dulu.
- **Jangan over-engineer.** Kalau suatu fitur cuma dipakai 1 kali dan
  nggak akan berubah-ubah, nggak perlu dibikin superfleksibel/configurable.
  Tulis yang paling langsung menyelesaikan masalah.

---

## Bagian A — Frontend: Daftar Kerja Konkret

### A.1 Pemetaan Alur GDD → Layar/Scene yang Harus Ada

Sesuai **Alur Plot Game** di GDD, ini daftar scene yang perlu ada di
`SceneEngine` (semuanya tetap di dalam route `/game`, bukan route
terpisah):

| # | Scene | Isi Konkret yang Harus Dibangun |
|---|---|---|
| 1 | Main Menu | Tombol "Start New Game", tombol "Quit" (quit = tampilkan layar akhir sederhana, TIDAK perlu benar-benar nutup browser) |
| 2 | World Narrative | Teks/cutscene naratif — **cukup teks bergulir + background statis dulu** (good enough), prolog dari GDD bisa dipakai sebagai draft isi teksnya |
| 3 | Character Creation | Pemain pilih 1 dari 4 kelas (Wizard/Priestess/Rogue/Fighter) — data kelasnya **wajib fetch dari Backend** (`GET` ke endpoint character/class, belum ada — untuk sementara boleh mock sesuai data di `BACKEND_CONTRACT.md` Bagian 5, ganti begitu Backend selesai) |
| 4 | Party Selection (3-4 karakter) | Loop create character untuk tiap pemain yang join session — pakai data `session_players` dari hasil `/session/join` yang sudah jalan sekarang |
| 5 | NPC Conflict (Dialogue) | `DialogueEngine` render percakapan — konten dialog **boleh hardcode dulu** (bukan dari AI), karena ini bagian cerita utama yang ditulis manual, bukan AI-generated |
| 6 | Pilihan Care/Don't Care | `ChoiceEngine` dengan 2 opsi, hasil pilihan disimpan sebagai story flag (`POST /story/flag`, belum final — bisa disimpan sementara di state lokal dulu, sinkronkan ke server begitu endpoint-nya siap) |
| 7 | Enter the World of Mind | Transisi scene (`AnimationEngine`) — **cukup fade transition dulu**, efek visual "masuk dunia pikiran" yang lebih kompleks itu polish tahap akhir |
| 8 | Eksplorasi (Battle/No Battle) | `BoardEngine` + `TileEngine` — grid sederhana, beberapa tile trigger battle, ini yang jadi fokus utama karena board system yang paling banyak dipakai |
| 9 | Battle System | Lihat detail combat di A.3 — ini bagian TERBESAR dan PALING PENTING dari Frontend |
| 10 | Win/Lose Screen | Lose → tombol "Continue?" (retry battle), Win → lanjut ke scene berikutnya |
| 11 | Background of the Problem | Sama seperti World Narrative — teks bergulir + background |
| 12 | Epilog | Sama seperti World Narrative, tapi jadi penutup — nggak perlu next button, cukup "Kembali ke Main Menu" |

**Prioritas urutan pembangunan** (bukan urutan cerita, tapi urutan
development supaya ada yang playable secepat mungkin):
1. Main Menu → Character Creation → Party Selection (paling gampang, base state)
2. Board + Movement + Dice (A.2)
3. Battle System (A.3) — INI YANG PALING BERAT, alokasikan waktu paling banyak
4. Dialogue + Choice (dengan konten dummy dulu)
5. Semua narrative screen (World Narrative, Background, Epilog) — paling gampang, kerjakan terakhir kalau waktu terbatas

### A.2 Board & Movement — Detail Konkret

Sesuai GDD, movement itu **grid-based ala Roll20**, bukan Monopoli:
- Pemain roll dice (misal hasil 6), lalu bisa jalan ke arah manapun
  (atas/bawah/kiri/kanan) sejauh total maksimal 6 kotak, TERMASUK bisa
  belok-belok (bukan garis lurus doang).
- `MovementEngine.moveTo()` harus validasi: jumlah langkah yang dipakai
  nggak boleh melebihi hasil dice, dan nggak boleh keluar batas grid atau
  numpuk di tile yang `blocked`.
- **Good enough untuk MVP**: grid ukuran tetap (misal 10×10, sesuai
  `lib/constants.ts` yang sudah ada `BOARD_WIDTH`/`BOARD_HEIGHT`), belum
  perlu grid dinamis per scene.

### A.3 Battle System — Detail Konkret (PALING PENTING)

Ikuti **Combat System** dari GDD persis, ini urutan state yang harus
diimplementasikan di `TurnEngine`/`BattleEngine` (catatan: `game-engine/`
saat ini belum punya `BattleEngine` terpisah di scaffold awal — Frontend
dev PERLU menambahkan folder `game-engine/battle/` dengan file baru,
ini contoh kasus wajar "perubahan struktur boleh terjadi" karena desain
awal belum mencakup combat detail):

1. **Roll Turn** — urutan giliran diacak di awal battle (data ini nanti
   dari Backend `battles.turn_order`, tapi untuk membangun UI-nya duluan
   boleh pakai random lokal dulu).
2. **Fase Pemain** — pemain pilih: gunakan skill (`ChoiceEngine` tampilkan
   daftar skill yang di-slot, dari `character_skills` via Backend) atau
   Skip Turn.
3. **Penentuan Target** — UI pemilihan target (musuh/kawan/diri sendiri),
   sesuai `tags` skill (`Attk` → target musuh, `Buff` ke kawan/diri, dst
   — field `tags` sudah ada di tabel `skills`, fetch dan pakai itu untuk
   filter target yang valid, JANGAN hardcode ulang aturan targeting).
4. **Reading & Q&A Session** — inilah titik integrasi ke AI. Backend
   kirim `question` + `difficulty` (difficulty dihitung Backend, BUKAN
   Frontend — lihat `BACKEND_CONTRACT.md` Bagian 4.3), Frontend tinggal
   render teks bacaan + pertanyaan + input jawaban.
5. **Correct/Incorrect** — hasil balik dari Backend (`is_correct`),
   Frontend animasikan Hit/Miss sesuai hasil itu — **JANGAN Frontend yang
   nentuin benar/salah sendiri**.
6. **Roll Damage** — angka damage yang ditampilkan HARUS dari response
   Backend (`damage_dealt`), Frontend cuma render angkanya + animasi.
7. **End Turn / Next Turn** — lanjut ke pemain/musuh berikutnya sesuai
   `turn_order`.
8. **Cek Target Mati** — kalau `enemy_current_hp <= 0` (dari Backend),
   battle selesai, munculkan Win screen.

**Good enough untuk MVP**: animasi combat boleh sesederhana "karakter
kedip" atau "angka damage muncul lalu hilang" — TIDAK perlu sprite
animation frame-by-frame di tahap awal. Fokus dulu ke: semua state di atas
berjalan berurutan dengan benar dan data yang ditampilkan akurat dari
Backend.

### A.4 Character Sheet / Status Menu

Sesuai GDD Bagian 1-2 (Atribut Utama & Distribusi Poin), Frontend perlu
komponen yang menampilkan:
- 5 stat utama (STR/DEX/CON/INT/WIS) + modifier-nya (`(stat-10)/2`
  dibulatkan bawah) — **modifier ini boleh dihitung di Frontend untuk
  tampilan**, karena itu murni display formatting dari angka yang sudah
  dikirim Backend, bukan keputusan gameplay. Bedanya dengan larangan di
  `BACKEND_CONTRACT.md`: yang dilarang itu Frontend MENENTUKAN hasil
  combat/damage sendiri, bukan sekadar format tampilan dari data resmi.
- HP/MP bar (current vs max)
- Level & EXP progress bar
- Slot skill (5 gacha + 2 special) — tampilkan yang `is_slotted = true`
  dari `character_skills`

### A.5 Skill Gacha UI

Sesuai GDD Bagian 6B: saat dapat kesempatan gacha, tampilkan **5 pilihan
skill acak** dari 10 skill gacha kelas tsb, pemain pilih 1. Untuk Skill
Spesial (6C), tampilkan **semua 5 pilihan** langsung tanpa acak.

**Good enough untuk MVP**: pengacakan 5 dari 10 ini bisa dilakukan di
Frontend (murni presentasi pilihan, bukan keputusan resmi apa yang
didapat — begitu pemain pilih, itu baru dikirim ke Backend buat disimpan
resmi ke `character_skills`).

---

## Bagian B — AI Service: Daftar Kerja Konkret

### B.1 Dataset RAG — Target Konkret untuk MVP

**Jangan coba bikin dataset besar/lengkap di awal.** Target realistis untuk
hackathon:
- **15-25 dokumen** campuran artikel asli (fakta) dan hoax, seputar tema
  yang relevan dengan literasi digital (sesuai tema game: misinformasi,
  cek fakta, kesehatan mental media sosial, dll — bebas topik apa saja
  yang masuk akal untuk "artikel yang perlu dicek kebenarannya").
- Simpan sebagai file teks sederhana dulu (`.txt`/`.md`) di
  `ai/app/rag/` atau folder data terpisah, baru di-ingest lewat
  `ingest.py` ke vector store.
- **Good enough**: dataset ini TIDAK perlu sempurna/terverifikasi secara
  jurnalistik — untuk demo hackathon, yang penting sistemnya bisa
  membedakan & menghasilkan pertanyaan dari isi dokumen yang ada.

### B.2 Article Generator (`article_generator.py`) — Detail Konkret

Menerima `topic` + `difficulty` (1-10) dari Backend, tugasnya:
1. Retrieve dokumen relevan dari vector store (`Retriever`) berdasarkan
   `topic`.
2. Generate artikel pendek (**good enough: 3-5 kalimat**, tidak perlu
   panjang) berdasarkan dokumen yang di-retrieve — bisa asli (dari fakta
   di dokumen) atau sengaja dibuat menyesatkan (hoax), tandai dengan
   `is_hoax`.
3. **Cara menerjemahkan `difficulty` ke konten** (karena Backend cuma
   kasih angka 1-10, AI dev yang menentukan artinya) — saran konkret:
   - Difficulty 1-3: fakta vs hoax yang perbedaannya jelas/gamblang
   - Difficulty 4-7: butuh baca teliti, ada detail yang menyesatkan halus
   - Difficulty 8-10: butuh pengetahuan tambahan/konteks untuk tahu itu
     hoax, bukan cuma dari teks itu sendiri

### B.3 Fact Checker (`fact_checker.py`) — Detail Konkret

Menerima `question_id` + jawaban pemain, tugasnya:
1. Ambil kembali konteks pertanyaan (artikel yang di-generate sebelumnya
   untuk `question_id` itu — **untuk MVP boleh simpan sementara di memory
   proses AI service, misal dict in-memory `{question_id: article_data}`**,
   TIDAK perlu database persisten di sisi AI, karena riwayat resmi tetap
   di tabel `battle_actions` milik Backend).
2. Bandingkan jawaban pemain dengan `is_hoax` yang sudah ditentukan saat
   generate — untuk MVP, ini bisa **exact match sederhana dulu**
   ("Fakta"/"Hoax" sebagai pilihan tetap), baru upgrade ke LLM-judge kalau
   ada waktu lebih (misal jawaban bebas teks yang perlu dinilai relevan/
   tidak).
3. Balikin `correct` (boolean) + `explanation` singkat (**good enough:
   1-2 kalimat**, kenapa itu fakta/hoax).

### B.4 NPC Dialogue & Narration — Detail Konkret

Ini yang paling ringan dibanding B.2/B.3 karena tidak perlu RAG:
- `npc_dialogue.py` — terima `npc_id` + `context` (ringkasan situasi dari
  Backend/Frontend), balikin 1 baris dialog yang sesuai persona NPC itu.
  **Good enough**: persona NPC boleh didefinisikan sebagai prompt template
  statis per `npc_id` (dictionary sederhana di kode), tidak perlu sistem
  persona yang canggih/dinamis.
- `narration.py` — mirip, terima `scene_id`, balikin teks narasi. Untuk
  MVP malah **boleh dipertimbangkan TIDAK pakai AI sama sekali** dan cukup
  teks statis yang ditulis manual (karena ini bagian cerita utama yang
  lebih konsisten kalau ditulis tangan) — AI generation di sini nilai
  tambahnya lebih kecil dibanding B.2/B.3 yang memang butuh variasi/AI.

### B.5 Urutan Pembangunan yang Disarankan

1. Kumpulkan dataset kecil dulu (B.1) — tanpa ini, semua endpoint lain
   nggak ada bahan.
2. `article_generator.py` (B.2) — endpoint paling sering dipanggil dalam
   loop combat, prioritas utama.
3. `fact_checker.py` (B.3) — pasangan langsung dari artikel yang
   di-generate, kerjakan bersamaan/setelah B.2.
4. `npc_dialogue.py` + `narration.py` (B.4) — kerjakan terakhir, atau
   skip AI-nya kalau waktu mepet (ganti teks statis, sesuai catatan di
   atas).

---

## Bagian C — Titik Temu yang Wajib Disinkronkan Bertiga

Beberapa hal ini butuh kesepakatan lintas 3 role sebelum masing-masing
lanjut kerja independen — jangan diasumsikan sendiri-sendiri:

1. **Bentuk `context` yang dikirim ke `npc_dialogue`** — apakah cuma
   teks ringkasan, atau termasuk riwayat dialog sebelumnya? (Frontend +
   Backend + AI perlu sepakat bareng)
2. **Berapa lama batas waktu jawab Q&A** (kalau ada time limit) — ini
   murni keputusan desain game, belum diputuskan di dokumen manapun,
   perlu didiskusikan sebelum Frontend bangun UI timer.
3. **Format pilihan jawaban** — apakah Q&A selalu pilihan ganda (lebih
   gampang untuk exact-match `fact_checker.py`), atau ada jawaban bebas
   teks? Ini menentukan kompleksitas B.3 secara signifikan, sebaiknya
   diputuskan di awal, bukan di tengah jalan.

Begitu ada keputusan soal 3 poin ini, update dokumen ini (atau
`BACKEND_CONTRACT.md`) supaya semua orang lihat versi yang sama.