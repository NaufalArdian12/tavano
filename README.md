# Tavano Lite — Belajar Pecahan Visual + AI Tutor ✨

> **Tavano Lite** adalah web app belajar **Matematika (Pecahan)** untuk SD/SMP yang fokus ke **visual learning**, **quiz interaktif**, dan **feedback AI** yang ramah anak.

## Demo 🚀
- Live App: 🔧 https://…
- API Health: 🔧 https://…/health
- Video Demo (≤ 5 menit): 🔧 https://…

---

## Fitur 🍕
- **Visual Step Learning**: materi per langkah (gambar & hints).
- **Quiz Interaktif**: pilihan gambar & drag-drop.
- **AI Grading (ChatGPT)**: Benar / Hampir Benar / Perlu Revisi + hint 1–2 kalimat.
- **Progress Tracking**: mastery per topik + step terakhir.
- **Sticker Rewards**: koleksi stiker motivasi.

---

## Tech Stack 🧩
**Frontend**
- React (Vite) + **TypeScript**
- TailwindCSS, Framer Motion
- Zustand

**Backend (BFF)**
- Express (TypeScript)
- Supabase (Auth, Postgres, Storage)
- OpenAI API (ChatGPT)

**Dev**
- pnpm workspaces (monorepo)
- ESM Node (NodeNext) atau Bundled (opsional)

---

## Struktur Monorepo 📦
```tavano/
├─ apps/
│ ├─ web/ # React + Vite + TS + Tailwind + Framer
│ └─ api/ # Express + TS + supabase-js + OpenAI
├─ packages/
│ └─ shared/ # (opsional) shared types/constants
├─ pnpm-workspace.yaml
└─ README.md
```

---

## Persiapan 🔧
- Node.js 18+ (disarankan 20+)
- pnpm 9/10+
- Akun **Supabase** (project + keys)
- API Key **OpenAI**

---

## Environment Variables 🔑
**`apps/web/.env`**
VITE_SUPABASE_URL=🔧
VITE_SUPABASE_ANON_KEY=🔧
VITE_API_URL=http://localhost:8787


**`apps/api/.env`**

```
PORT=8787
OPENAI_API_KEY=🔧
SUPABASE_URL=🔧
SUPABASE_ANON_KEY=🔧
SUPABASE_SERVICE_ROLE_KEY=🔧 # server-only, jangan ke client!
```

> Contoh tersedia di: `apps/web/.env.example` & `apps/api/.env.example`.

---

## Setup & Run 🏁
```bash
# 1) install dependencies
pnpm install

# 2a) jalankan API (dari root)
pnpm dev:api

# 2b) jalankan Web (dari root)
pnpm dev:web

# atau keduanya bareng
pnpm dev
```
URL default
Web: http://localhost:5173
API: http://localhost:8787

