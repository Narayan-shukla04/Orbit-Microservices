import { createProxyMiddleware } from "http-proxy-middleware";

// ─── Service Base URLs (from .env) ───────────────────────────────────────────
const AUTH_SERVICE_URL      = process.env.AUTH_SERVICE_URL      || "http://localhost:3001";
const GUILD_SERVICE_URL     = process.env.GUILD_SERVICE_URL     || "http://localhost:3003";
const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL || "http://localhost:3004";
const FRIENDS_SERVICE_URL   = process.env.FRIENDS_SERVICE_URL   || "http://localhost:3006";
const VOICE_SERVICE_URL     = process.env.VOICE_SERVICE_URL     || "http://localhost:3005";

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
// /api/guild/*   → http://localhost:3003/api/server/*
// /api/channel/* → http://localhost:3003/api/server/channel/*
// /api/role/*    → http://localhost:3003/api/server/role/*
export const guildProxy = makeProxy(GUILD_SERVICE_URL, "/api/server");
export const channelProxy = makeProxy(GUILD_SERVICE_URL, "/api/server/channel");
export const roleProxy = makeProxy(GUILD_SERVICE_URL, "/api/server/role");

// ─── Messaging Service  (port 3004) ──────────────────────────────────────────
// /api/message/* → http://localhost:3004/api/messages/*
export const messageProxy = makeProxy(MESSAGING_SERVICE_URL, "/api/messages");

// ─── Friends Service  (port 3006) ─────────────────────────────────────────────
// /api/friends/* → http://localhost:3006/api/friends/*
export const friendsProxy = createProxyMiddleware({
  target: FRIENDS_SERVICE_URL,
  changeOrigin: true,
  ws: true, // proxy WebSocket upgrade for Socket.IO
  pathRewrite: (path) => `/api/friends${path}`,
});

// ─── Voice Service  (port 3005) ──────────────────────────────────────────────
// /api/calls/* → http://localhost:3005/api/calls/*
export const voiceProxy = makeProxy(VOICE_SERVICE_URL, "/api/calls");

// ─── Public routes - bypass JWT in app.js ────────────────────────────────────
export const PUBLIC_PATHS = [
  "/health",
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

  // ── Guild-Service (specific routes first) ─────────────────────────────────
  app.use("/api/channel", channelProxy);
  app.use("/api/server/channel", channelProxy);
  app.use("/api/role", roleProxy);
  app.use("/api/server/role", roleProxy);
  app.use("/api/guild", guildProxy);
  app.use("/api/server", guildProxy);

  // ── Messaging-Service ─────────────────────────────────────────────────────
  app.use("/api/messages", messageProxy);
  app.use("/api/message", messageProxy);

  // ── Friends-Service ───────────────────────────────────────────────────────
  app.use("/api/friends", friendsProxy);

  // ── Voice-Service ──────────────────────────────────────────────────────────
  app.use("/api/calls", voiceProxy);
};