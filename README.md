# UNESCO Youth Hackathon — Educational AI Board Game

Web-based digital tabletop RPG (mirip D&D + Roll20 + Visual Novel) untuk 1 layar,
maksimal 4 pemain, tanpa Game Master manusia — sistem game menggantikan peran GM.
Tema: literasi digital / fact-checking (deteksi hoax) yang dibungkus dalam
petualangan berbasis grid map + visual novel.

Dokumen lengkap ada di folder [`docs/`](./docs):

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — penjelasan arsitektur & alasan desain
- [`docs/FOLDER_STRUCTURE.md`](./docs/FOLDER_STRUCTURE.md) — penjelasan tiap folder
- [`docs/DEVELOPMENT_FLOW.md`](./docs/DEVELOPMENT_FLOW.md) — roadmap pengembangan
- [`docs/TEAM_RESPONSIBILITY.md`](./docs/TEAM_RESPONSIBILITY.md) — pembagian peran tim
- [`docs/CODING_CONVENTION.md`](./docs/CODING_CONVENTION.md)
- [`docs/NAMING_CONVENTION.md`](./docs/NAMING_CONVENTION.md)
- [`docs/GIT_BRANCH_CONVENTION.md`](./docs/GIT_BRANCH_CONVENTION.md)
- [`docs/COMMIT_CONVENTION.md`](./docs/COMMIT_CONVENTION.md)

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, Zustand |
| Backend | FastAPI |
| AI | Ollama + RAG (retrieval-augmented generation) |
| Database | Supabase |
| Infra | Docker Compose, GitHub Actions |

## Quick Start (Local Dev)

```bash
# 1. Copy env files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ai/.env.example ai/.env

# 2. Jalankan setup script
bash scripts/dev-setup.sh

# 3. Jalankan tiap service (terminal terpisah)
cd frontend && npm run dev        # http://localhost:3000
cd backend  && uvicorn app.main:app --reload   # http://localhost:8000
cd ai       && uvicorn app.main:app --reload --port 8001

# ATAU jalankan semua sekaligus dengan Docker:
docker compose -f docker/docker-compose.yml up --build
```

## Status Proyek

Semua file di repo ini adalah **placeholder/scaffold**. Belum ada logic asli —
tujuannya supaya struktur project sudah final di awal hackathon, tim tinggal
mengisi (fill-in) tiap fungsi sesuai pembagian di `TEAM_RESPONSIBILITY.md`.

Tidak ada satupun file kosong. Setiap engine punya method dasar
(`init`, `start`, `pause`, `resume`, `stop`), setiap komponen React
me-render UI "Coming Soon", setiap endpoint API mengembalikan
`{"message": "Coming Soon"}`.
