# Backend API — Astha Dhunagana Portfolio

Node.js + Express + TypeScript API for the portfolio content management and contact form.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the admin password and optional email credentials:

```bash
cp .env.example .env
```

## Run

```bash
npm run dev        # development (hot reload on :4000)
npm run build      # compile TypeScript to dist/
npm start          # run compiled build
```

## Endpoints

| Method | Path              | Auth         | Description                                   |
| ------ | ----------------- | ------------ | --------------------------------------------- |
| GET    | `/api/health`     | —            | Health check                                  |
| GET    | `/api/content`    | —            | Fetch all site content                        |
| POST   | `/api/auth/login` | —            | Sign in → `{ token }`                         |
| PUT    | `/api/content`    | Bearer token | Save all site content                         |
| POST   | `/api/content/reset` | Bearer token | Restore default seed content              |
| POST   | `/api/contact`    | —            | Submit a contact form message                 |
| GET    | `/api/contact`    | —            | List stored messages (development helper)     |

### Content storage

All site content lives in `data/content.json` and is seeded with defaults on first
run. The frontend (and the `/admin` panel) read and write this through the API.

### POST /api/contact

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "projectType": "Steel",
  "message": "I'd like to discuss a warehouse design."
}
```

- Validates input with Zod (400 on failure).
- Stores the message to `data/messages.json`.
- If `RESEND_API_KEY` is set, also emails the message via Resend.

## Environment variables

| Variable           | Required | Default                              | Description                      |
| ------------------ | -------- | ------------------------------------ | -------------------------------- |
| `PORT`             | no       | `4000`                               | Server port                      |
| `ADMIN_PASSWORD`   | no       | `admin123`                           | Password for the admin panel     |
| `RESEND_API_KEY`   | no       | —                                    | Resend API key for emailing      |
| `RESEND_FROM_EMAIL`| no       | `portfolio <onboarding@resend.dev>`  | Sender address (Resend-verified) |
| `RESEND_TO_EMAIL`  | no       | `astha.dhunagana@engineer.com`       | Recipient of contact messages    |
