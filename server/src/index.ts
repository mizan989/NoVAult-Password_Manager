import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { generalLimiter } from "./middleware/rateLimiter";
import { sanitizeInput } from "./middleware/sanitize";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import vaultRoutes from "./routes/vaultRoutes";
import generatorRoutes from "./routes/generatorRoutes";

const app = express();

// Trust reverse proxy (required for Render, Heroku, etc. for accurate IP rate limiting)
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "no-referrer",
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
  })
);

// Split comma-separated URLs and trim trailing slashes
const allowedOrigins = env.clientUrl
  .split(",")
  .map((u) => u.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      const isDevLocalhost =
        !env.isProd &&
        (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin));

      if (allowedOrigins.includes(cleanOrigin) || isDevLocalhost) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeInput);
app.use(cookieParser(env.cookieSecret));

// Health check endpoint (placed before rate limiting so uptime monitors / keep-alive pings are never throttled)
app.get("/health", (req, res) => {
  res.json({ success: true, message: "NoVAult API is running", timestamp: new Date() });
});

app.use(generalLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "NoVAult API",
    status: "online",
    message: "Zero-Knowledge Password Manager API is healthy and operational.",
    version: "1.0.0",
    healthCheck: "/health",
  });
});

// Sensitive API routes must never be cached by browsers, proxies, or CDNs
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/generate-password", generatorRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[NoVAult] Server listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
