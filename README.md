# Astha Dhunagana — Structural Engineer Portfolio

Monorepo with a **Next.js + Tailwind** frontend and an **Express + TypeScript** backend.

```
aastha_portfolio/
├── frontend/   # Next.js 16 app (portfolio UI + admin panel at /admin)
└── backend/    # Express REST API (content management + contact form)
```

> All website content is **managed from the admin panel**. Nothing is hardcoded —
> the frontend fetches everything from the backend content API.

## Quick start

```bash
# install all dependencies
npm run install:all

# run backend (:4000) and frontend (:3000) together
npm run dev
```

Open http://localhost:3000.

## Admin panel

1. Start the backend and frontend (above).
2. Open **http://localhost:3000/admin**.
3. Sign in with the backend `ADMIN_PASSWORD` (default `admin123` — change it in production).
4. Edit any section (Profile, Navigation, Hero, About, Expertise, Projects, Experience, CTA, Contact, Footer), then click **Save changes**.

Edits are stored in `backend/data/content.json` and served live to the website. The
panel also includes a **Reset defaults** action to restore the original seed content.

## Environment variables

| File                | Variable             | Purpose                                            |
| ------------------- | -------------------- | -------------------------------------------------- |
| `frontend/.env`     | `NEXT_PUBLIC_API_URL`| Backend base URL (default `http://localhost:4000`) |
| `backend/.env`      | `ADMIN_PASSWORD`     | Password for the `/admin` panel (default `admin123`) |
| `backend/.env`      | `RESEND_API_KEY`     | Enables email delivery for contact form            |

Copy from the `.env.example` files in each directory.

## Contact form flow

1. `frontend/components/ContactForm.tsx` POSTs to `{API_URL}/api/contact`.
2. `backend` validates with Zod, stores to `backend/data/messages.json`.
3. If `RESEND_API_KEY` is set, the message is also emailed to `RESEND_TO_EMAIL`.

## Content API

| Method | Path               | Auth | Description                                  |
| ------ | ------------------ | ---- | -------------------------------------------- |
| GET    | `/api/content`     | —    | Fetch all site content (used by the website) |
| POST   | `/api/auth/login`  | —    | Sign in with `ADMIN_PASSWORD` → `{ token }`  |
| PUT    | `/api/content`     | Bearer token | Save all site content              |
| POST   | `/api/content/reset`| Bearer token | Restore default seed content     |

## Scripts (run from root)

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start both servers with hot reload       |
| `npm run build`  | Build backend + frontend                 |
| `npm run typecheck` | Type-check both packages              |
| `npm run lint`   | Lint frontend                            |