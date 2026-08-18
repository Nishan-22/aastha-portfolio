import express, { type Request, type Response } from "express";
import cors from "cors";
import contactRouter from "./routes/contact.js";
import contentRouter from "./routes/content.js";
import uploadRouter from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());

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
