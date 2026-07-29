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

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(env.cookieSecret));
app.use(generalLimiter);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "NoVAult API is running", timestamp: new Date() });
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
