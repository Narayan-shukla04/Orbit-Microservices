import { createProxyMiddleware } from "http-proxy-middleware";

const AUTH_SERVICE_URL      = process.env.AUTH_SERVICE_URL      || "http://localhost:3001";
const GUILD_SERVICE_URL     = process.env.GUILD_SERVICE_URL     || "http://localhost:3003";
const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL || "http://localhost:3004";
const FRIENDS_SERVICE_URL   = process.env.FRIENDS_SERVICE_URL   || "http://localhost:3006";
const VOICE_SERVICE_URL     = process.env.VOICE_SERVICE_URL     || "http://localhost:3005";

const stripDownstreamCors = (proxyRes) => {
  delete proxyRes.headers["access-control-allow-origin"];
  delete proxyRes.headers["access-control-allow-credentials"];
  delete proxyRes.headers["access-control-allow-methods"];
  delete proxyRes.headers["access-control-allow-headers"];
};

const makeProxy = (target, mountPath) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${mountPath}${path}`,
    on: {
      proxyRes: stripDownstreamCors,
    },
  });

export const authProxy = makeProxy(AUTH_SERVICE_URL, "/api/auth");
export const userProxy = makeProxy(AUTH_SERVICE_URL, "/api/user");

export const guildProxy = makeProxy(GUILD_SERVICE_URL, "/api/server");
export const channelProxy = makeProxy(GUILD_SERVICE_URL, "/api/server/channel");
export const roleProxy = makeProxy(GUILD_SERVICE_URL, "/api/server/role");

export const messageProxy = makeProxy(MESSAGING_SERVICE_URL, "/api/messages");

export const friendsProxy = createProxyMiddleware({
  target: FRIENDS_SERVICE_URL,
  changeOrigin: true,
  ws: true,
  pathRewrite: (path) => `/api/friends${path}`,
  on: {
    proxyRes: stripDownstreamCors,
  },
});

export const voiceProxy = makeProxy(VOICE_SERVICE_URL, "/api/calls");

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

export const proxyMount = (app) => {
  app.use("/api/auth", authProxy);
  app.use("/api/user", userProxy);

  app.use("/api/channel", channelProxy);
  app.use("/api/server/channel", channelProxy);
  app.use("/api/role", roleProxy);
  app.use("/api/server/role", roleProxy);
  app.use("/api/guild", guildProxy);
  app.use("/api/server", guildProxy);

  app.use("/api/messages", messageProxy);
  app.use("/api/message", messageProxy);

  app.use("/api/friends", friendsProxy);

  app.use("/api/calls", voiceProxy);
};