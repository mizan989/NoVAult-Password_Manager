import { z } from "zod";
import { generatePassword, scorePasswordStrength } from "../utils/passwordGenerator";
import { sendSuccess } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const generatePasswordSchema = z
  .object({
    length: z.number().min(6).max(64).default(16),
    uppercase: z.boolean().default(true),
    lowercase: z.boolean().default(true),
    numbers: z.boolean().default(true),
    symbols: z.boolean().default(true),
    excludeSimilar: z.boolean().default(false),
  })
  .refine(
    (data) => data.uppercase || data.lowercase || data.numbers || data.symbols,
    { message: "At least one character set must be selected" }
  );

export const generatePasswordController = asyncHandler(async (req, res) => {
  const options = req.body;
  const password = generatePassword(options);
  const strength = scorePasswordStrength(password);

  sendSuccess(res, { password, strength });
});
