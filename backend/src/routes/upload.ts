import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { requireAuth } from "../lib/requireAuth.js";
import { readRateLimit } from "../lib/rateLimits.js";

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
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

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
const ALLOWED_FORMATS = ["jpg", "png", "webp", "gif", "mp4", "webm", "pdf"];

function cloudinaryCredentials(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET };
  }
  const url = process.env.CLOUDINARY_URL;
  const match = url?.match(/^cloudinary:\/\/([^:@]+):([^@]+)@(.+)$/);
  if (match) {
    return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
  }
  return null;
}

router.get("/upload/signature", requireAuth, readRateLimit, (_req, res) => {
  const creds = cloudinaryCredentials();
  if (!creds) {
    return res.status(500).json({ error: "Cloudinary is not configured" });
  }
  const timestamp = Math.round(Date.now() / 1000);
  // Params must be sorted alphabetically for Cloudinary signature verification.
  const paramsToSign = `allowed_formats=${ALLOWED_FORMATS.join(",")}&folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${creds.apiSecret}`)
    .digest("hex");
  return res.json({
    cloudName: creds.cloudName,
    apiKey: creds.apiKey,
    timestamp,
    signature,
    folder: CLOUDINARY_FOLDER,
    allowedFormats: ALLOWED_FORMATS,
  });
});

router.post("/upload", requireAuth, readRateLimit, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const file = req.file;
  try {
    const ext = MIME_MAP[file.mimetype] ?? path.extname(file.originalname);
    const publicId = `${CLOUDINARY_FOLDER}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: "auto", type: "upload", access_mode: "public" },
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
    return res.status(500).json({ error: "Upload failed" });
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
