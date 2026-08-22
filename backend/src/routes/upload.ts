import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { verifyToken } from "../lib/auth.js";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (MIME_MAP[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed") as never);
    }
  },
});

const router = Router();

const CLOUDINARY_FOLDER = "aastha-portfolio";

router.get("/upload/signature", requireAuth, (_req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: "Cloudinary is not configured" });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
  return res.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: CLOUDINARY_FOLDER,
  });
});

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const file = req.file;
  try {
    const ext = MIME_MAP[file.mimetype] ?? path.extname(file.originalname);
    const publicId = `${CLOUDINARY_FOLDER}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: "auto" },
        (err, result) => {
          if (err) return reject(err);
          if (!result) return reject(new Error("Upload returned no result"));
          return resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    return res.json({ url: result.secure_url });
  } catch (err: unknown) {
    console.error("Upload failed:", err);
    const detail =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: unknown }).message)
        : undefined;
    return res.status(500).json({ error: `Upload failed${detail ? `: ${detail}` : ""}` });
  }
});

router.use((err: Error & { status?: number }, _req: Request, res: Response, next: NextFunction) => {
  if (err.status === 401) return res.status(401).json({ error: "Unauthorized" });
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 4 MB)" : err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;