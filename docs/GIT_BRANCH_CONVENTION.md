# Git Branch Convention

## Branch Utama

- `main` — selalu dalam kondisi bisa didemokan (deployable/stable).
- `develop` — integrasi harian selama hackathon, semua feature branch merge ke sini dulu.

## Feature Branch

Format: `<type>/<scope>-<short-description>`

```
feature/board-movement-engine
feature/ai-fact-checker
fix/dice-roll-out-of-bounds
chore/setup-docker-compose
docs/update-architecture
```

Tipe yang dipakai:

- `feature/` — fitur baru
- `fix/` — perbaikan bug
- `chore/` — setup, config, tooling, tidak mengubah behavior game
- `docs/` — perubahan dokumentasi saja
- `refactor/` — perubahan struktur kode tanpa mengubah behavior

## Alur Kerja

1. Branch dari `develop`, bukan dari `main`.
2. Kerjakan di scope folder milikmu (lihat `TEAM_RESPONSIBILITY.md`).
3. Push, buka Pull Request ke `develop`.
4. Minimal 1 reviewer (idealnya yang punya folder terkait, atau Tech Lead)
   sebelum merge.
5. `develop` di-merge ke `main` menjelang sesi demo/submission saja.

## Aturan Tambahan Selama Hackathon (waktu terbatas)

- Boleh commit langsung ke branch sendiri sesering mungkin (commit kecil,
  jangan tunggu "selesai total").
- Hindari force-push ke `develop`/`main`.
- Kalau ada konflik file yang sering ditabrak bareng (misal
  `frontend/src/app/game/page.tsx`), koordinasi dulu di chat tim sebelum
  mulai edit bareng.
