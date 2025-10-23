# Tavano Lite — Visual Fraction Learning + AI Tutor ✨

> **Tavano Lite** is a web app for learning **Mathematics (Fractions)** for elementary and middle school students, focusing on **visual learning**, **interactive quizzes**, and **friendly AI feedback**.

## Demo 🚀
- Live App: 🔧 https://…
- API Health: 🔧 https://…/health
- Video Demo (≤ 5 minutes): 🔧 https://…

---

## Features 🍕
- **Visual Step Learning**: step-by-step materials (illustrations & hints).
- **Interactive Quiz**: image choices & drag-and-drop.
- **AI Grading (ChatGPT)**: Correct / Almost Correct / Needs Revision + 1–2 sentence hints.
- **Progress Tracking**: mastery per topic + last step.
- **Sticker Rewards**: motivational sticker collection.

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
- ESM Node (NodeNext) or Bundled (optional)

---

## Monorepo Structure 📦
```tavano/
├─ apps/
│ ├─ web/ # React + Vite + TS + Tailwind + Framer
│ └─ api/ # Express + TS + supabase-js + OpenAI
├─ packages/
│ └─ shared/ # (optional) shared types/constants
├─ pnpm-workspace.yaml
└─ README.md
```

---

## Requirements 🔧
- Node.js 18+ (20+ recommended)
- pnpm 9/10+
- **Supabase** account (project + keys)
- API Key **OpenAI**

---

## Environment Variables 🔑
**`apps/web/.env`**
```
VITE_SUPABASE_URL=🔧
VITE_SUPABASE_ANON_KEY=🔧
VITE_API_URL=http://localhost:8787
```

**`apps/api/.env`**
```
PORT=8787
OPENAI_API_KEY=🔧
SUPABASE_URL=🔧
SUPABASE_ANON_KEY=🔧
SUPABASE_SERVICE_ROLE_KEY=🔧 # server-only, do not expose to client!
```

> Examples are available in: `apps/web/.env.example` & `apps/api/.env.example`.

---

## Setup & Run 🏁
```bash
# 1) install dependencies
pnpm install

# 2a) run API (from root)
pnpm dev:api

# 2b) run Web (from root)
pnpm dev:web

# or run both
pnpm dev
```
URL default  
Web: http://localhost:5173  
API: http://localhost:8787
