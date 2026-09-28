import { createProxyMiddleware } from "http-proxy-middleware";

// ─── Service Base URLs (from .env) ───────────────────────────────────────────
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const GUILD_SERVICE_URL = process.env.GUILD_SERVICE_URL || "http://localhost:3003";
const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL || "http://localhost:3004";

// ─── Proxy factory helper ─────────────────────────────────────────────────────
// When Express mounts proxy on "/api/auth", it strips "/api/auth" from req.url
// before the proxy sees it. We must rewrite the path back so the downstream
// service gets the full path (e.g. /api/auth/login, /api/guild/create).
const makeProxy = (target, mountPath) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    // Restore the stripped prefix so downstream gets the full URL
    pathRewrite: (path) => `${mountPath}${path}`,
  });

// ─── Auth Service  (port 3001) ───────────────────────────────────────────────
// /api/auth/*  → http://localhost:3001/api/auth/*
// /api/user/*  → http://localhost:3001/api/user/*
export const authProxy = makeProxy(AUTH_SERVICE_URL, "/api/auth");
export const userProxy = makeProxy(AUTH_SERVICE_URL, "/api/user");

// ─── Guild Service  (port 3003) ──────────────────────────────────────────────
// /api/guild/*    → http://localhost:3003/api/guild/*
// /api/channel/*  → http://localhost:3003/api/channel/*
// /api/role/*     → http://localhost:3003/api/role/*
export const guildProxy = makeProxy(GUILD_SERVICE_URL, "/api/guild");
export const channelProxy = makeProxy(GUILD_SERVICE_URL, "/api/channel");
export const roleProxy = makeProxy(GUILD_SERVICE_URL, "/api/role");

// ─── Messaging Service  (port 3004) ──────────────────────────────────────────
// /api/message/*  → http://localhost:3004/api/message/*
export const messageProxy = makeProxy(MESSAGING_SERVICE_URL, "/api/message");

// ─── Public routes - bypass JWT in app.js ────────────────────────────────────
export const PUBLIC_PATHS = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/forget-password",
  "/api/auth/verify-otp",
  "/api/auth/reset-password",
  "/api/auth/google",
  "/api/auth/google/callback",
];

// ─── Mount all proxies onto the Express app ───────────────────────────────────
export const proxyMount = (app) => {
  // ── Auth-Service ─────────────────────────────────────────────────────────
  app.use("/api/auth", authProxy);   // register, login, google, logout …
  app.use("/api/user", userProxy);   // getme, update-details, update-profile …

  // ── Guild-Service ─────────────────────────────────────────────────────────
  app.use("/api/guild", guildProxy);       // create, getserver, join, kick, leave …
  app.use("/api/channel", channelProxy);   // create, update, getchannels
  app.use("/api/role", roleProxy);         // create, update, getroles, delete

  // ── Messaging-Service ─────────────────────────────────────────────────────
  app.use("/api/message", messageProxy);   // createmessage, getallmessages
};