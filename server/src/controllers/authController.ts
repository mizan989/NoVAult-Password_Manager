import { Response } from "express";
import argon2 from "argon2";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import User from "../models/User";
import OtpToken from "../models/OtpToken";
import { generateOtpCode, hashOtpCode, sendOtpEmail } from "../services/emailService";
import { hashMasterPassword, verifyMasterPassword, generateSalt } from "../encryption/argon2";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  cookieOptions,
} from "../services/tokenService";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import { AuthedRequest } from "../middleware/auth";
import { purgeUserKeyCache } from "./vaultController";

const googleClient = new OAuth2Client(env.googleClientId);

// ---------- Validation Schemas ----------
export const registerSchema = z.object({
  name: z.string().min(2).max(60).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  code: z.string().length(6).trim(),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const masterPasswordSchema = z.object({
  masterPassword: z.string().min(10),
});

export const verifyMasterPasswordSchema = z.object({
  masterPassword: z.string().min(1),
});

export const updateNameSchema = z.object({
  name: z.string().min(2).max(60).trim(),
});

// ---------- Helpers ----------
function issueSession(res: Response, userId: string, email: string, tokenVersion: number = 0) {
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId, email, tokenVersion });

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
}

// ---------- Controllers ----------

/** Step 1 of email registration: create unverified user + send OTP */
export const register = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = (req.body.email as string).toLowerCase().trim();

  const existing = await User.findOne({ email });
  if (existing && existing.isEmailVerified) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await argon2.hash(password);

  const user =
    existing ||
    (await User.create({
      name,
      email,
      provider: "email",
      isEmailVerified: false,
    }));

  user.name = name;
  user.passwordHash = passwordHash;
  await user.save();

  const code = generateOtpCode();
  await OtpToken.deleteMany({ email, purpose: "register" });
  await OtpToken.create({
    email,
    codeHash: hashOtpCode(code),
    purpose: "register",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, code);

  sendSuccess(res, { email }, "Verification code sent to your email");
});

/** Step 2 of email registration: verify OTP, mark email verified */
export const verifyOtp = asyncHandler(async (req, res) => {
  const code = (req.body.code as string).trim();
  const email = (req.body.email as string).toLowerCase().trim();

  const otp = await OtpToken.findOne({ email, purpose: "register" }).sort({ createdAt: -1 });
  if (!otp) throw ApiError.badRequest("No verification code found. Please register again.");

  if (otp.attempts >= 5) {
    throw ApiError.badRequest("Too many attempts. Please request a new code.");
  }

  if (otp.expiresAt < new Date()) {
    throw ApiError.badRequest("Verification code has expired. Please request a new code.");
  }

  const computedHash = hashOtpCode(code);
  const otpHashBuf = Buffer.from(otp.codeHash, "utf8");
  const compHashBuf = Buffer.from(computedHash, "utf8");
  const isMatch =
    otpHashBuf.length === compHashBuf.length &&
    crypto.timingSafeEqual(otpHashBuf, compHashBuf);

  if (!isMatch) {
    otp.attempts += 1;
    await otp.save();
    throw ApiError.badRequest("Invalid verification code");
  }

  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found");

  user.isEmailVerified = true;
  await user.save();
  await OtpToken.deleteMany({ email, purpose: "register" });

  const { accessToken, refreshToken } = issueSession(res, user.id, user.email, user.tokenVersion || 0);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
    refreshToken,
  }, "Email verified");
});

/** Email + password login */
export const login = asyncHandler(async (req, res) => {
  const password = req.body.password;
  const email = (req.body.email as string).toLowerCase().trim();

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  if (!user.isEmailVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) throw ApiError.unauthorized("Invalid email or password");

  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = issueSession(res, user.id, user.email, user.tokenVersion || 0);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
    refreshToken,
  }, "Logged in");
});

/** Google OAuth sign-in / sign-up */
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!env.googleClientId) {
    throw ApiError.internal("Google OAuth is not configured on this server");
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
  } catch (err: any) {
    console.error("[NoVAult] Google token verification failed:", err?.message || err);
    throw ApiError.unauthorized("Invalid or expired Google token");
  }

  const payload = ticket.getPayload();
  if (!payload?.email) throw ApiError.unauthorized("Invalid Google token payload");

  const email = payload.email.toLowerCase().trim();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: payload.name || email.split("@")[0],
      email,
      provider: "google",
      googleId: payload.sub,
      isEmailVerified: true,
    });
  } else if (!user.googleId) {
    // Existing email-based account, same email -> link accounts
    user.googleId = payload.sub;
    user.provider = user.provider === "email" ? "both" : "google";
    await user.save();
  }

  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = issueSession(res, user.id, user.email, user.tokenVersion || 0);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
    refreshToken,
  }, "Logged in with Google");
});

/** Create the vault master password (first time, after signup/login) */
export const createMasterPassword = asyncHandler(async (req: AuthedRequest, res) => {
  const { masterPassword } = req.body;
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  if (user.hasMasterPassword) throw ApiError.conflict("Master password already set");

  const salt = generateSalt();
  const hash = await hashMasterPassword(masterPassword);

  user.masterPasswordHash = hash;
  user.masterPasswordSalt = salt;
  user.hasMasterPassword = true;
  await user.save();

  sendSuccess(res, { hasMasterPassword: true }, "Vault created", 201);
});

/** Verify master password to unlock the vault for this session */
export const verifyMasterPasswordController = asyncHandler(async (req: AuthedRequest, res) => {
  const { masterPassword } = req.body;
  const userId = req.user!.userId;

  const user = await User.findById(userId).select("+masterPasswordHash");
  if (!user || !user.masterPasswordHash) throw ApiError.badRequest("Master password not set");

  const valid = await verifyMasterPassword(user.masterPasswordHash, masterPassword);
  if (!valid) throw ApiError.unauthorized("Incorrect master password");

  sendSuccess(res, { unlocked: true }, "Vault unlocked");
});

export const logout = asyncHandler(async (req: AuthedRequest, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  let userIdToPurge: string | undefined = req.user?.userId;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      userIdToPurge = payload.userId;
      await User.findByIdAndUpdate(payload.userId, { $inc: { tokenVersion: 1 } });
    } catch {
      // Ignore if expired or malformed
    }
  } else if (userIdToPurge) {
    await User.findByIdAndUpdate(userIdToPurge, { $inc: { tokenVersion: 1 } });
  } else if (req.headers.authorization?.toLowerCase().startsWith("bearer ")) {
    try {
      const bearerToken = req.headers.authorization.substring(7).trim();
      const payload = verifyAccessToken(bearerToken);
      userIdToPurge = payload.userId;
      await User.findByIdAndUpdate(payload.userId, { $inc: { tokenVersion: 1 } });
    } catch {
      // Ignore if expired or malformed
    }
  }

  if (userIdToPurge) {
    purgeUserKeyCache(userIdToPurge);
  }

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendSuccess(res, null, "Logged out");
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token provided");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw ApiError.unauthorized("User account no longer exists");
  }

  // If token has a version and is older than user's current tokenVersion, reject
  if (payload.tokenVersion !== undefined && user.tokenVersion !== undefined) {
    if (payload.tokenVersion < user.tokenVersion) {
      throw ApiError.unauthorized("Session revoked. Please log in again.");
    }
  }

  const { accessToken, refreshToken: newRefreshToken } = issueSession(
    res,
    user.id,
    user.email,
    user.tokenVersion || 0
  );

  sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, "Session refreshed");
});

export const me = asyncHandler(async (req: AuthedRequest, res) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw ApiError.notFound("User not found");

  sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    hasMasterPassword: user.hasMasterPassword,
  });
});

export const updateName = asyncHandler(async (req: AuthedRequest, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user!.userId);
  if (!user) throw ApiError.notFound("User not found");

  user.name = name;
  await user.save();

  sendSuccess(res, { name: user.name }, "Name updated");
});
