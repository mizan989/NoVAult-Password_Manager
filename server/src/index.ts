import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import vaultRoutes from "./routes/vaultRoutes";
import generatorRoutes from "./routes/generatorRoutes";

const app = express();

// Trust reverse proxy (required for Render, Heroku, etc. for accurate IP rate limiting)
app.set("trust proxy", 1);

app.use(helmet());

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
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes("*") ||
        cleanOrigin.endsWith(".vercel.app") ||
        (!env.isProd && (cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")))
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
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
