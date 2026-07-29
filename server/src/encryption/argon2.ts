import argon2 from "argon2";
import crypto from "crypto";
import { env } from "../config/env";

/**
 * Argon2id key derivation.
 *
 * We use Argon2id in two distinct ways:
 *  1. To hash the Master Password for verification at login (standard argon2.hash / argon2.verify).
 *  2. To derive a raw 32-byte symmetric key from the Master Password, used to encrypt/decrypt
 *     vault items with AES-256-GCM. This key is NEVER stored - it's re-derived every unlock.
 */

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 4,
  parallelism: 2,
};

/** Hash the master password for storage/verification (login check). */
export async function hashMasterPassword(masterPassword: string): Promise<string> {
  return argon2.hash(masterPassword + env.encryptionPepper, ARGON2_OPTIONS);
}

/** Verify a master password attempt against the stored hash. */
export async function verifyMasterPassword(
  hash: string,
  masterPassword: string
): Promise<boolean> {
  return argon2.verify(hash, masterPassword + env.encryptionPepper);
}

/**
 * Derive a raw 32-byte encryption key from the master password + a per-user salt.
 * This key lives only in memory for the duration of a request/session - never persisted.
 */
export async function deriveEncryptionKey(
  masterPassword: string,
  saltHex: string
): Promise<Buffer> {
  const salt = Buffer.from(saltHex, "hex");
  const rawHash = await argon2.hash(masterPassword + env.encryptionPepper, {
    ...ARGON2_OPTIONS,
    salt,
    raw: true,
    hashLength: 32,
  });
  return rawHash as unknown as Buffer;
}

/** Generate a new random salt (per user) used for key derivation. */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}
