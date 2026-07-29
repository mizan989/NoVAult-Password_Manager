import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
     return jwt.sign(payload, env.jwtAccessSecret, {
       expiresIn: env.jwtAccessExpires,
     } as jwt.SignOptions);
   }

   export function signRefreshToken(payload: AccessTokenPayload): string {
     return jwt.sign(payload, env.jwtRefreshSecret, {
       expiresIn: env.jwtRefreshExpires,
     } as jwt.SignOptions);
   }

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as AccessTokenPayload;
}

export const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("strict" as const) : ("lax" as const),
  path: "/",
};
