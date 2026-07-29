import mongoose, { Schema, Document } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  codeHash: string;
  purpose: "register" | "login" | "reset";
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>({
  email: { type: String, required: true, lowercase: true, index: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, enum: ["register", "login", "reset"], required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// TTL index - Mongo automatically removes expired OTP docs
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);
