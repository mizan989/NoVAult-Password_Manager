import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/tokenService";
import { ApiError } from "../utils/ApiError";

export interface AuthedRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
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
    req.user = payload;
    next();
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired session"));
  }
}

/**
 * Deprecated: Vault unlock is strictly client-side in Zero-Knowledge model.
 * Kept as pass-through for backwards compatibility.
 */
export function requireVaultUnlock(req: AuthedRequest, res: Response, next: NextFunction) {
  next();
}
