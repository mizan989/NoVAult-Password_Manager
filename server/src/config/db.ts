import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri);
    console.log("[NoVAult] MongoDB connected");
  } catch (err) {
    console.error("[NoVAult] MongoDB connection error:", err);
    process.exit(1);
  }
}
