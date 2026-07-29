import { Response } from "express";
import argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import User from "../models/User";
import OtpToken from "../models/OtpToken";
import { generateOtpCode, hashOtpCode, sendOtpEmail } from "../services/emailService";
import { hashMasterPassword, verifyMasterPassword, generateSalt } from "../encryption/argon2";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  cookieOptions,
} from "../services/tokenService";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import { AuthedRequest } from "../middleware/auth";

const googleClient = new OAuth2Client(env.googleClientId);

// ---------- Validation Schemas ----------
export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const googleAuthSchema = z.object({
  idToken: z.string(),
});

export const masterPasswordSchema = z.object({
  masterPassword: z.string().min(10),
});

export const verifyMasterPasswordSchema = z.object({
  masterPassword: z.string().min(1),
});

export const updateNameSchema = z.object({
  name: z.string().min(2).max(60),
});

// ---------- Helpers ----------
function issueSession(res: Response, userId: string, email: string) {
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId, email });

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
  const { name, email, password } = req.body;

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
  const { email, code } = req.body;

  const otp = await OtpToken.findOne({ email, purpose: "register" }).sort({ createdAt: -1 });
  if (!otp) throw ApiError.badRequest("No verification code found. Please register again.");

  if (otp.attempts >= 5) {
    throw ApiError.badRequest("Too many attempts. Please request a new code.");
  }

  if (otp.codeHash !== hashOtpCode(code)) {
    otp.attempts += 1;
    await otp.save();
    throw ApiError.badRequest("Invalid verification code");
  }

  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found");

  user.isEmailVerified = true;
  await user.save();
  await OtpToken.deleteMany({ email, purpose: "register" });

  const { accessToken } = issueSession(res, user.id, user.email);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
  }, "Email verified");
});

/** Email + password login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

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

  const { accessToken } = issueSession(res, user.id, user.email);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
  }, "Logged in");
});

/** Google OAuth sign-in / sign-up */
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw ApiError.unauthorized("Invalid Google token");

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
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

  const { accessToken } = issueSession(res, user.id, user.email);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, hasMasterPassword: user.hasMasterPassword },
    accessToken,
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

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendSuccess(res, null, "Logged out");
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token");

  const payload = verifyRefreshToken(token);
  const { accessToken } = issueSession(res, payload.userId, payload.email);

  sendSuccess(res, { accessToken }, "Session refreshed");
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
