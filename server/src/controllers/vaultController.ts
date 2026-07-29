import { Response } from "express";
import { z } from "zod";
import Vault from "../models/Vault";
import User from "../models/User";
import { encrypt, decrypt } from "../encryption/crypto";
import { deriveEncryptionKey } from "../encryption/argon2";
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

/** Derive the user's AES key from the master password header + stored salt. */
async function getEncryptionKey(userId: string, masterPassword: string) {
  const user = await User.findById(userId).select("+masterPasswordSalt +masterPasswordHash");
  if (!user?.masterPasswordSalt) throw ApiError.badRequest("Vault not initialized");
  return deriveEncryptionKey(masterPassword, user.masterPasswordSalt);
}

function decryptItem(item: any, key: Buffer) {
  const json = decrypt(
    { ciphertext: item.ciphertext, iv: item.iv, authTag: item.authTag },
    key
  );
  return {
    id: item._id,
    type: item.type,
    category: item.category,
    favourite: item.favourite,
    data: JSON.parse(json),
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

  let decrypted;
  try {
    decrypted = items.map((item) => decryptItem(item, key));
  } catch {
    throw ApiError.unauthorized("Incorrect master password");
  }

  sendSuccess(res, decrypted);
});

export const searchVaultItems = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const masterPassword = req.headers["x-master-password"] as string;
  const key = await getEncryptionKey(req.user!.userId, masterPassword);
  const query = ((req.query.q as string) || "").toLowerCase();

  const items = await Vault.find({ userId: req.user!.userId });

  let decrypted;
  try {
    decrypted = items.map((item) => decryptItem(item, key));
  } catch {
    throw ApiError.unauthorized("Incorrect master password");
  }

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
  const item = await Vault.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });
  if (!item) throw ApiError.notFound("Vault item not found");

  sendSuccess(res, null, "Item deleted");
});
