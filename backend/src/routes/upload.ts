import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { verifyToken } from "../lib/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

const MIME_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

function requireAuth(req: { headers: Record<string, unknown> }, _res: unknown, next: (err?: unknown) => void) {
  const header = (req.headers.authorization as string | undefined) ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !verifyToken(token)) {
    const err = new Error("Unauthorized") as Error & { status?: number };
    err.status = 401;
    return next(err);
  }
  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = MIME_MAP[file.mimetype] ?? path.extname(file.originalname);
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (MIME_MAP[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed") as never);
    }
  },
});

const router = Router();

router.post("/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const url = `/uploads/${req.file.filename}`;
  return res.json({ url });
});

router.use((err: Error & { status?: number }, _req: Request, res: Response, next: NextFunction) => {
  if (err.status === 401) return res.status(401).json({ error: "Unauthorized" });
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 100 MB)" : err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;