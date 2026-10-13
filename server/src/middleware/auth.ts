import { Request, Response, NextFunction } from "express";
import { isTokenVersionCurrent, verifyAccessToken } from "../services/tokenService";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";

export interface AuthedRequest extends Request {
  user?: { userId: string; email: string };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.accessToken;

    if (!token && authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      throw ApiError.unauthorized("No access token provided");
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select("tokenVersion");
    if (!user || !isTokenVersionCurrent(payload.tokenVersion, user.tokenVersion)) {
      throw ApiError.unauthorized("Invalid or expired session");
    }
    req.user = payload;
    next();
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired session"));
  }
}

/**
 * Requires the vault-unlock header carrying the derived key context.
 * The actual AES key is derived per-request from the master password
 * sent over HTTPS in this header - it is never persisted server-side.
 */
export function requireVaultUnlock(req: AuthedRequest, res: Response, next: NextFunction) {
  const masterPassword = req.headers["x-master-password"];
  if (!masterPassword || typeof masterPassword !== "string") {
    throw ApiError.unauthorized("Vault is locked - master password required");
  }
  next();
}
