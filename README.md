# Astha Dhunagana — Structural Engineer Portfolio

Monorepo with a **Next.js + Tailwind** frontend and an **Express + TypeScript** backend, both deployable to **Vercel**. Content and contact messages are stored in **MongoDB Atlas**; admin file uploads use **Vercel Blob**.

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

> Local dev needs `MONGODB_URI` (and `BLOB_READ_WRITE_TOKEN` for uploads) in `backend/.env`.

## Admin panel

1. Start the backend and frontend (above).
2. Open **http://localhost:3000/admin**.
3. Sign in with the backend `ADMIN_PASSWORD` (default `admin123` — change it in production).
4. Edit any section (Profile, Navigation, Hero, About, Expertise, Projects, Experience, CTA, Contact, Footer), then click **Save changes**.

Edits are stored in the `content` collection of your MongoDB database and served live
to the website. The panel also includes a **Reset defaults** action to restore the
original seed content.

## Environment variables

| File                | Variable              | Purpose                                            |
| ------------------- | --------------------- | -------------------------------------------------- |
| `frontend/.env`     | `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:4000`) |
| `backend/.env`      | `MONGODB_URI`         | MongoDB Atlas connection string (required)         |
| `backend/.env`      | `MONGODB_DB`          | Database name (default `aastha_portfolio`)         |
| `backend/.env`      | `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token (admin uploads)          |
| `backend/.env`      | `ADMIN_PASSWORD`      | Password for the `/admin` panel (default `admin123`) |
| `backend/.env`      | `RESEND_API_KEY`      | Enables email delivery for contact form            |

Copy from the `.env.example` files in each directory.

## Contact form flow

1. `frontend/components/ContactForm.tsx` POSTs to `{API_URL}/api/contact`.
2. `backend` validates with Zod, stores the message in the `messages` MongoDB collection.
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

## Deploying to Vercel

Two Vercel projects from this monorepo (Vercel's [monorepo support](https://vercel.com/docs/monorepos) links both):

1. **Backend project** — root directory `backend/`. Vercel auto-detects Express
   (default export in `src/app.ts`) and runs it as a serverless function.
2. **Frontend project** — root directory `frontend/`. Vercel auto-detects Next.js.

Set the following env vars in the Vercel dashboard:

| Project  | Variable                | Value                                              |
| -------- | ----------------------- | -------------------------------------------------- |
| backend  | `MONGODB_URI`           | Your real Atlas connection string (with real password) |
| backend  | `MONGODB_DB`            | `aastha_portfolio`                                 |
| backend  | `ADMIN_PASSWORD`        | Your admin password                                |
| backend  | `BLOB_READ_WRITE_TOKEN` | Created automatically when you add a **Blob store** to the project |
| backend  | `RESEND_API_KEY`        | Optional, for contact-form emails                  |
| frontend | `NEXT_PUBLIC_API_URL`   | The backend project's URL (e.g. `https://your-api.vercel.app`) |

Notes:

- Create a **Blob store** in the backend project first (Project → Storage → Blob) so
  `BLOB_READ_WRITE_TOKEN` is injected automatically.
- In MongoDB Atlas, allow network access from anywhere (`0.0.0.0/0`) so Vercel's
  functions can reach it.
- Uploaded files are capped at **4 MB** (Vercel's serverless body limit; was 100 MB).
- To preserve content you already edited locally before the first deploy, run
  `npm run migrate --prefix backend` once MongoDB is reachable — it loads
  `backend/data/content.json` and `backend/data/messages.json` into MongoDB.