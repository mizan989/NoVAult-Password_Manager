import { Response } from "express";
import { z } from "zod";
import Vault from "../models/Vault";
import User from "../models/User";
import mongoose from "mongoose";
import crypto from "crypto";
import { encrypt, decrypt } from "../encryption/crypto";
import { deriveEncryptionKey, verifyMasterPassword } from "../encryption/argon2";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

export const createVaultItemSchema = z.object({
  type: z.enum(["password", "note", "card", "identity", "apikey"]),
  category: z.string().default("General"),
  favourite: z.boolean().default(false),
  // Arbitrary item fields - shape depends on `type` (title, username, password, url, notes, etc.)
  data: z.record(z.any()),
});

export const updateVaultItemSchema = z.object({
  category: z.string().optional(),
  favourite: z.boolean().optional(),
  data: z.record(z.any()).optional(),
});

const keyCache = new Map<string, { key: Buffer; expiresAt: number }>();

/** Derive the user's AES key after verifying the master password against stored hash. */
async function getEncryptionKey(userId: string, masterPassword: string): Promise<Buffer> {
  if (!masterPassword || typeof masterPassword !== "string") {
    throw ApiError.unauthorized("Vault is locked - master password required");
  }

  const cacheKey = `${userId}:${crypto.createHash("sha256").update(masterPassword).digest("hex")}`;
  const cached = keyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.key;
  }

  const user = await User.findById(userId).select("+masterPasswordSalt +masterPasswordHash");
  if (!user?.masterPasswordSalt || !user?.masterPasswordHash) {
    throw ApiError.badRequest("Vault not initialized - please set a master password first");
  }

  const isValid = await verifyMasterPassword(user.masterPasswordHash, masterPassword);
  if (!isValid) {
    throw ApiError.unauthorized("Incorrect master password");
  }

  const key = await deriveEncryptionKey(masterPassword, user.masterPasswordSalt);
  // Cache derived key in RAM for 5 minutes to avoid event-loop exhaustion on frequent requests
  keyCache.set(cacheKey, { key, expiresAt: Date.now() + 5 * 60 * 1000 });

  if (keyCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of keyCache.entries()) {
      if (v.expiresAt <= now) {
        v.key.fill(0);
        keyCache.delete(k);
      }
    }
  }

  return key;
}

function decryptItem(item: any, key: Buffer) {
  let parsedData = {};
  try {
    const json = decrypt(
      { ciphertext: item.ciphertext, iv: item.iv, authTag: item.authTag },
      key
    );
    parsedData = JSON.parse(json);
  } catch (err) {
    console.error(`[NoVAult] Decryption failed for item ${item._id}:`, err);
    parsedData = { title: "Encrypted Item (Corrupted)", error: true };
  }

  return {
    id: item._id,
    type: item.type,
    category: item.category,
    favourite: item.favourite,
    data: parsedData,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const listVaultItems = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const masterPassword = req.headers["x-master-password"] as string;
  const key = await getEncryptionKey(req.user!.userId, masterPassword);

  const { type } = req.query;
  const filter: Record<string, unknown> = { userId: req.user!.userId };
  if (type) filter.type = type;

  const items = await Vault.find(filter).sort({ updatedAt: -1 });
  const decrypted = items.map((item) => decryptItem(item, key));

  sendSuccess(res, decrypted);
});

export const searchVaultItems = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const masterPassword = req.headers["x-master-password"] as string;
  const key = await getEncryptionKey(req.user!.userId, masterPassword);
  const query = ((req.query.q as string) || "").toLowerCase();

  const items = await Vault.find({ userId: req.user!.userId });
  const decrypted = items.map((item) => decryptItem(item, key));

  // Search happens after decryption, in-memory, per request - never indexed server-side
  const results = decrypted.filter((item) => {
    const haystack = JSON.stringify(item.data).toLowerCase() + item.category.toLowerCase();
    return haystack.includes(query);
  });

  sendSuccess(res, results);
});

export const createVaultItem = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const masterPassword = req.headers["x-master-password"] as string;
  const key = await getEncryptionKey(req.user!.userId, masterPassword);

  const { type, category, favourite, data } = req.body;
  const payload = encrypt(JSON.stringify(data), key);

  const item = await Vault.create({
    userId: req.user!.userId,
    type,
    category,
    favourite,
    ciphertext: payload.ciphertext,
    iv: payload.iv,
    authTag: payload.authTag,
    history: [],
  });

  sendSuccess(res, decryptItem(item, key), "Item created", 201);
});

export const updateVaultItem = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest("Invalid vault item ID");
  }

  const masterPassword = req.headers["x-master-password"] as string;
  const key = await getEncryptionKey(req.user!.userId, masterPassword);

  const item = await Vault.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!item) throw ApiError.notFound("Vault item not found");

  const { category, favourite, data } = req.body;

  if (data) {
    // Preserve previous version in history before overwriting
    item.history.push({
      ciphertext: item.ciphertext,
      iv: item.iv,
      authTag: item.authTag,
      changedAt: new Date(),
    });
    if (item.history.length > 10) {
      item.history = item.history.slice(-10);
    }
    const payload = encrypt(JSON.stringify(data), key);
    item.ciphertext = payload.ciphertext;
    item.iv = payload.iv;
    item.authTag = payload.authTag;
  }
  if (category !== undefined) item.category = category;
  if (favourite !== undefined) item.favourite = favourite;

  await item.save();

  sendSuccess(res, decryptItem(item, key), "Item updated");
});

export const deleteVaultItem = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest("Invalid vault item ID");
  }

  const item = await Vault.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });
  if (!item) throw ApiError.notFound("Vault item not found");

  sendSuccess(res, null, "Item deleted");
});

/** Zero-out and remove derived AES keys from server memory for a user */
export function purgeUserKeyCache(userId: string) {
  for (const [k, v] of keyCache.entries()) {
    if (k.startsWith(`${userId}:`)) {
      v.key.fill(0);
      keyCache.delete(k);
    }
  }
}

/** Explicitly lock vault and purge RAM key cache */
export const lockVault = asyncHandler(async (req: AuthedRequest, res: Response) => {
  purgeUserKeyCache(req.user!.userId);
  sendSuccess(res, null, "Vault locked");
});
