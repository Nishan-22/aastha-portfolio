# Astha Dhunagana — Structural Engineer Portfolio

Monorepo with a **Next.js + Tailwind** frontend and an **Express + TypeScript** backend, both deployable to **Vercel**. Content and contact messages are stored in **MongoDB Atlas**; admin file uploads use **Cloudinary**.

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
| `frontend/.env`     | `NEXT_PUBLIC_API_URL` | Local dev only — backend base URL (`http://localhost:4000`). Leave unset in production (Vercel Services handles it) |
| `backend/.env`      | `MONGODB_URI`         | MongoDB Atlas connection string (required)         |
| `backend/.env`      | `MONGODB_DB`          | Database name (default `aastha_portfolio`)         |
| `backend/.env`      | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (admin uploads)            |
| `backend/.env`      | `CLOUDINARY_API_KEY`  | Cloudinary API key                                 |
| `backend/.env`      | `CLOUDINARY_API_SECRET` | Cloudinary API secret                            |
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

## Deploying to Vercel (single project)

This repo uses **Vercel Services** — the frontend and backend deploy together as **one
project on one domain**, configured in the root `vercel.json`. Import the repo once.

1. At **vercel.com/new**, import the `aastha-portfolio` repo.
2. On the Configure Project screen:
   - **Root directory**: repo root `/`.
   - **Framework Preset**: select **Services** (required — otherwise Vercel ignores `vercel.json`).
   - Click **Deploy**.
3. In project **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `MONGODB_URI` | Your real Atlas connection string |
   | `MONGODB_DB` | `aastha_portfolio` |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
   | `ADMIN_PASSWORD` | Your admin password (change from `admin123`) |
   | `RESEND_API_KEY` | Optional, for contact-form emails |
   | `RESEND_TO_EMAIL` | Optional, where contact emails go |

   Do **not** set `NEXT_PUBLIC_API_URL` — the Services binding injects the backend URL
   server-side, and the browser uses same-origin paths.
4. In **MongoDB Atlas → Network Access**, allow `0.0.0.0/0` so Vercel can reach it.
5. Redeploy after adding env vars. Verify:
   - `https://<project>.vercel.app` renders the portfolio.
   - `https://<project>.vercel.app/api/health` returns `{"status":"ok",...}`.
   - `https://<project>.vercel.app/admin` login + uploads work.

Notes:

- Files uploaded via `/admin` are stored in **Cloudinary**; MongoDB keeps the URL strings.
- Uploaded files are capped at **4 MB** (Vercel's serverless body limit).
- To preserve content you already edited locally before the first deploy, run
  `npm run migrate --prefix backend` once MongoDB is reachable — it loads
  `backend/data/content.json` and `backend/data/messages.json` into MongoDB.