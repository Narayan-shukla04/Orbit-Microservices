import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middleware/verifyToken.js";
import { proxyMount, PUBLIC_PATHS } from "../routes/proxies.js";

const app = express();

// ⚠️ DO NOT use express.json() here.
// The gateway proxies raw request streams to downstream services.
// Parsing the body with express.json() consumes the stream and causes
// the proxy to hang or forward empty bodies (the #1 cause of slowness).
app.use(cors());
app.use(cookieParser()); // needed to read the JWT cookie

// Skip JWT verification for public auth routes (register, login, google, etc.)
app.use((req, res, next) => {
  const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
  if (isPublic) return next();
  return verifyToken(req, res, next);
});

// Mount all service proxies
proxyMount(app);

export default app;