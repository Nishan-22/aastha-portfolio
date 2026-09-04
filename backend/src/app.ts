import express, { type Request, type Response } from "express";
import type { CorsRequest } from "cors";
import cors from "cors";
import helmet from "helmet";
import contactRouter from "./routes/contact.js";
import contentRouter from "./routes/content.js";
import uploadRouter from "./routes/upload.js";

const app = express();

app.disable("x-powered-by");
// One trusted proxy hop (Vercel edge -> function) so req.ip is the real visitor.
app.set("trust proxy", 1);

// Explicitly allowed extra origins (comma-separated). Optional — same-origin
// traffic via Vercel rewrites and local dev are always allowed.
const extraOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors((req: CorsRequest, callback) => {
    const origin = req.headers.origin;
    const allow = (() => {
      if (!origin) return true; // SSR / server-to-server
      const host = req.headers.host;
      if (host) {
        try {
          if (new URL(origin).host === host) return true; // same-origin rewrite
        } catch {
          return false;
        }
      }
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return true; // local dev
      }
      return extraOrigins.includes(origin);
    })();
    callback(null, { origin: allow });
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "astha-portfolio-backend" });
});

app.use("/api", contactRouter);
app.use("/api", contentRouter);
app.use("/api", uploadRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
