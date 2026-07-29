import mongoose, { Schema, Document } from "mongoose";

export type AuthProvider = "email" | "google" | "both";

export interface IUser extends Document {
  name: string;
  email: string;
  provider: AuthProvider;
  googleId?: string;
  passwordHash?: string; // login password hash (email accounts only)
  masterPasswordHash?: string; // Argon2id hash of the vault master password
  masterPasswordSalt?: string; // salt used for deriving the AES key from master password
  isEmailVerified: boolean;
  hasMasterPassword: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    provider: { type: String, enum: ["email", "google", "both"], default: "email" },
    googleId: { type: String, default: null },
    passwordHash: { type: String, select: false },
    masterPasswordHash: { type: String, select: false },
    masterPasswordSalt: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: false },
    hasMasterPassword: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model<IUser>("User", UserSchema);
