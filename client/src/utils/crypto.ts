/**
 * Client-Side Zero-Knowledge Cryptography for NoVAult.
 * Uses native Web Crypto API (SubtleCrypto & getRandomValues) - zero external dependencies.
 */

// Helper: Convert Uint8Array to hex string
export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

// Helper: Convert hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Helper: Convert Uint8Array to Base64
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to Uint8Array
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive Master Encryption Key (AES-256-GCM) from Master Password + per-user salt.
 * Key is non-extractable and lives exclusively in browser memory.
 */
export async function deriveMasterKey(masterPassword: string, saltHex: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const salt = hexToBytes(saltHex);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 600000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable for memory protection
    ["encrypt", "decrypt"]
  );
}

/**
 * Derive Auth Hash to authenticate with the server.
 * The server verifies this hash; it never receives the master password or MasterKey.
 */
export async function deriveAuthHash(masterPassword: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${masterPassword}:${saltHex}:novault-auth-v1`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string; // base64
  authTag: string; // base64
}

/**
 * Encrypt arbitrary JSON data client-side with AES-256-GCM using a fresh 96-bit random IV.
 */
export async function encryptVaultItem(
  data: Record<string, unknown>,
  key: CryptoKey
): Promise<EncryptedPayload> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encodedData = enc.encode(JSON.stringify(data));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    encodedData
  );

  // Web Crypto AES-GCM output is ciphertext concatenated with 16-byte auth tag at the end
  const fullBytes = new Uint8Array(encryptedBuffer);
  const tagLen = 16;
  const ciphertextBytes = fullBytes.slice(0, fullBytes.length - tagLen);
  const authTagBytes = fullBytes.slice(fullBytes.length - tagLen);

  return {
    ciphertext: bytesToBase64(ciphertextBytes),
    iv: bytesToBase64(iv),
    authTag: bytesToBase64(authTagBytes),
  };
}

/**
 * Decrypt an AES-256-GCM encrypted item client-side.
 */
export async function decryptVaultItem(
  payload: EncryptedPayload,
  key: CryptoKey
): Promise<Record<string, unknown>> {
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);
  const authTag = base64ToBytes(payload.authTag);

  // Recombine ciphertext and auth tag for Web Crypto Subtle decrypt
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    combined as unknown as BufferSource
  );

  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decryptedBuffer));
}

let activeMasterKey: CryptoKey | null = null;

export function setActiveCryptoKey(key: CryptoKey | null) {
  activeMasterKey = key;
}

export function getActiveCryptoKey(): CryptoKey | null {
  return activeMasterKey;
}
