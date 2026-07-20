# Folder Structure

```
unesco-hackathon/
├── README.md
├── docker/
│   └── docker-compose.yml
├── .github/workflows/ci.yml
├── docs/                        ← semua dokumentasi (file ini)
│
├── frontend/                    ← Next.js 15 + React 19 + TS + Tailwind + Zustand
│   ├── src/
│   │   ├── app/                 ← routing MINIMAL: login, session, character, /game
│   │   │   ├── page.tsx                 (Login)
│   │   │   ├── session/create/page.tsx
│   │   │   ├── session/join/page.tsx
│   │   │   ├── character/page.tsx
│   │   │   └── game/page.tsx            (SATU-SATUNYA halaman gameplay)
│   │   │
│   │   ├── game-engine/         ← LOGIC GAME, TypeScript murni, tanpa JSX
│   │   │   ├── core/    GameEngine, GameLoop, SceneEngine, EventEngine,
│   │   │   │            CameraEngine, AnimationEngine
│   │   │   ├── story/   StoryEngine, DialogueEngine, ChoiceEngine, EndingEngine
│   │   │   ├── board/   BoardEngine, TileEngine, MovementEngine, DiceEngine, TurnEngine
│   │   │   ├── inventory/ InventoryEngine
│   │   │   └── save/    SaveEngine
│   │   │
│   │   ├── components/
│   │   │   ├── game/    Board, Player, NPC, DialogueBox, ChoiceBox, Inventory,
│   │   │   │            HUD, MiniMap, DiceUI, PauseMenu, SaveMenu, LoadingScreen,
│   │   │   │            Notification
│   │   │   └── ui/      Button, Modal (primitive UI dipakai bersama)
│   │   │
│   │   ├── store/       useGameStore, usePlayerStore, useStoryStore,
│   │   │                useBoardStore, useSessionStore (Zustand)
│   │   ├── services/    authService, sessionService, gameService, aiService,
│   │   │                saveService (HTTP client ke backend)
│   │   ├── types/       tipe TypeScript yang dipakai lintas file
│   │   └── lib/         supabaseClient, constants
│   │
│   └── public/assets/   sprites/ backgrounds/ tiles/ audio/ (aset visual novel & board)
│
├── backend/                     ← FastAPI
│   └── app/
│       ├── api/v1/       HTTP layer tipis: auth, session, player, story,
│       │                 dialogue, dice, inventory, ending, ai_gateway
│       ├── services/     business logic sesungguhnya per domain
│       ├── engines/       logic yang perlu server-authoritative (turn_engine)
│       ├── db/           supabase_client, repositories (repository pattern)
│       ├── models/        pydantic schemas
│       └── core/         config, security (JWT)
│
├── ai/                           ← Service AI terpisah (Ollama + RAG)
│   └── app/
│       ├── rag/          ingest, vector_store, retriever
│       ├── generation/   article_generator, fact_checker, npc_dialogue, narration
│       └── ollama_client.py
│
├── shared/contracts/     tempat kontrak tipe API yang dipakai bersama FE/BE
├── assets/design-source/ file desain mentah (Figma export, dll) — TERPISAH dari
│                         frontend/public/assets yang sudah final/optimized
└── scripts/              dev-setup.sh, seed-db.py
```

## Kenapa `game-engine/` dipisah dari `components/`?

Ini bagian paling penting dari arsitektur ini. `game-engine/` isinya file
`.ts` murni (bukan `.tsx`) — tidak boleh import React. Alasannya:

- Bisa di-unit-test tanpa perlu render React sama sekali.
- Logic tidak "kebawa" oleh siklus render React — engine punya siklus
  hidupnya sendiri (`init → start → pause/resume → stop`), lebih mirip
  game engine sungguhan (Phaser, Unity-style) daripada komponen web biasa.
- Kalau suatu saat mau ganti frontend framework, `game-engine/` bisa
  dipindah nyaris tanpa perubahan.

## Kenapa `assets/design-source/` terpisah dari `frontend/public/assets/`?

`frontend/public/assets/` isinya aset yang SUDAH final & siap dipakai
production (sudah dikompres, ukuran final). `assets/design-source/` isinya
file mentah desainer (misal `.psd`, `.fig` export, sprite sheet belum
dipotong) — supaya repo produksi tidak berat oleh file source desain.
