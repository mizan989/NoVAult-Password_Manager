import mongoose, { Schema, Document, Types } from "mongoose";

export type VaultItemType = "password" | "note" | "card" | "identity" | "apikey";

export interface IVaultHistoryEntry {
  ciphertext: string;
  iv: string;
  authTag: string;
  changedAt: Date;
}

export interface IVaultItem extends Document {
  userId: Types.ObjectId;
  type: VaultItemType;
  category: string;
  favourite: boolean;
  // Encrypted blob - contains a JSON string of the actual item fields
  // (e.g. { title, username, password, url, notes } for a password item)
  ciphertext: string;
  iv: string;
  authTag: string;
  history: IVaultHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IVaultHistoryEntry>(
  {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const VaultSchema = new Schema<IVaultItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["password", "note", "card", "identity", "apikey"],
      required: true,
    },
    category: { type: String, default: "General" },
    favourite: { type: Boolean, default: false },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

VaultSchema.index({ userId: 1, type: 1 });

export default mongoose.model<IVaultItem>("Vault", VaultSchema);
