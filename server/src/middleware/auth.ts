import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/tokenService";
import { ApiError } from "../utils/ApiError";

export interface AuthedRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) throw ApiError.unauthorized("No access token provided");

    const payload = verifyAccessToken(token);
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
