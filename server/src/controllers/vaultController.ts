import { Response } from "express";
import { z } from "zod";
import Vault from "../models/Vault";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

export const createVaultItemSchema = z.object({
  type: z.enum(["password", "note", "card", "identity", "apikey"]),
  category: z.string().default("General"),
  favourite: z.boolean().default(false),
  ciphertext: z.string().min(1),
  iv: z.string().min(1),
  authTag: z.string().min(1),
});

export const updateVaultItemSchema = z.object({
  category: z.string().optional(),
  favourite: z.boolean().optional(),
  ciphertext: z.string().optional(),
  iv: z.string().optional(),
  authTag: z.string().optional(),
});

function formatItem(item: any) {
  return {
    id: item._id,
    type: item.type,
    category: item.category,
    favourite: item.favourite,
    ciphertext: item.ciphertext,
    iv: item.iv,
    authTag: item.authTag,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const listVaultItems = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { type } = req.query;
  const filter: Record<string, unknown> = { userId: req.user!.userId };
  if (type) filter.type = type;

  // Bound results to 100 per request to prevent resource exhaustion
  const items = await Vault.find(filter).sort({ updatedAt: -1 }).limit(100);

  sendSuccess(res, items.map(formatItem));
});

export const searchVaultItems = asyncHandler(async (req: AuthedRequest, res: Response) => {
  // In Zero-Knowledge architecture, search happens client-side; endpoint returns user's encrypted items
  const items = await Vault.find({ userId: req.user!.userId }).sort({ updatedAt: -1 }).limit(100);
  sendSuccess(res, items.map(formatItem));
});

export const createVaultItem = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { type, category, favourite, ciphertext, iv, authTag } = req.body;

  const item = await Vault.create({
    userId: req.user!.userId,
    type,
    category,
    favourite,
    ciphertext,
    iv,
    authTag,
    history: [],
  });

  sendSuccess(res, formatItem(item), "Item created", 201);
});

export const updateVaultItem = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest("Invalid vault item ID");
  }

  const item = await Vault.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!item) throw ApiError.notFound("Vault item not found");

  const { category, favourite, ciphertext, iv, authTag } = req.body;

  if (ciphertext && iv && authTag) {
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
    item.ciphertext = ciphertext;
    item.iv = iv;
    item.authTag = authTag;
  }
  if (category !== undefined) item.category = category;
  if (favourite !== undefined) item.favourite = favourite;

  await item.save();

  sendSuccess(res, formatItem(item), "Item updated");
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
