import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middleware/verifyToken.js";
import { proxyMount, PUBLIC_PATHS } from "../routes/proxies.js";

const app = express();

app.set("trust proxy", 1);

const clientOrigins = [
  ...new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, "")) : []),
  ]),
];

app.use(cors({
  origin: clientOrigins,
  credentials: true,
}));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "api-gateway" });
});

app.use((req, res, next) => {
  const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
  if (isPublic) return next();
  return verifyToken(req, res, next);
});

proxyMount(app);

export default app;