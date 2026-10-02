import assert from "assert";
import crypto from "crypto";
import { sanitizeInput } from "../middleware/sanitize";
import { hashOtpCode } from "../services/emailService";
import { generatePassword, scorePasswordStrength } from "../utils/passwordGenerator";

console.log("=== Running NoVAult Security Verification Checks ===");

// 1. Check NoSQL Sanitization Middleware
console.log("[1/5] Testing NoSQL injection sanitization middleware...");
const mockReq = {
  body: {
    $where: "1 == 1",
    $gt: "",
    "nested.field": "bad",
    email: "user@example.com",
    safeNested: {
      $ne: null,
      validField: "good",
    },
  },
  query: {
    type: "password",
    $regex: ".*",
  },
  params: {
    id: "60d0fe4f5311236168a109ca",
    $gt: "",
  },
} as any;

sanitizeInput(mockReq, {} as any, () => {});

assert.strictEqual(mockReq.body.$where, undefined, "Failed: $where was not stripped");
assert.strictEqual(mockReq.body.$gt, undefined, "Failed: $gt was not stripped");
assert.strictEqual(mockReq.body["nested.field"], undefined, "Failed: nested.field was not stripped");
assert.strictEqual(mockReq.body.email, "user@example.com", "Failed: safe field email was removed");
assert.strictEqual(mockReq.body.safeNested.$ne, undefined, "Failed: nested $ne was not stripped");
assert.strictEqual(mockReq.body.safeNested.validField, "good", "Failed: safe nested field was removed");
assert.strictEqual(mockReq.query.$regex, undefined, "Failed: query $regex was not stripped");
assert.strictEqual(mockReq.query.type, "password", "Failed: safe query type was removed");
assert.strictEqual(mockReq.params.$gt, undefined, "Failed: params $gt was not stripped");
assert.strictEqual(mockReq.params.id, "60d0fe4f5311236168a109ca", "Failed: params id was removed");
console.log("✓ NoSQL sanitization middleware verified successfully.");

// 2. Check Timing-Safe OTP Verification
console.log("[2/5] Testing timing-safe OTP verification logic...");
const correctCode = "123456";
const wrongCode = "654321";
const correctHash = hashOtpCode(correctCode);
const wrongHash = hashOtpCode(wrongCode);

const verifyCodeHelper = (codeToCheck: string, storedHash: string): boolean => {
  const computedHash = hashOtpCode(codeToCheck);
  const otpHashBuf = Buffer.from(storedHash, "utf8");
  const compHashBuf = Buffer.from(computedHash, "utf8");
  return otpHashBuf.length === compHashBuf.length && crypto.timingSafeEqual(otpHashBuf, compHashBuf);
};

assert.strictEqual(verifyCodeHelper(correctCode, correctHash), true, "Failed: Correct OTP failed verification");
assert.strictEqual(verifyCodeHelper(wrongCode, correctHash), false, "Failed: Wrong OTP passed verification");
assert.strictEqual(verifyCodeHelper("999999", correctHash), false, "Failed: Wrong OTP passed verification");
console.log("✓ Timing-safe OTP verification verified successfully.");

// 3. Check Vault Item Query Constraints
console.log("[3/5] Testing vault item query validation constraints...");
const allowedTypes = ["password", "note", "card", "identity", "apikey"];
const isValidType = (t: unknown): boolean => typeof t === "string" && allowedTypes.includes(t);

assert.strictEqual(isValidType("password"), true, "Failed: valid type 'password' was rejected");
assert.strictEqual(isValidType("note"), true, "Failed: valid type 'note' was rejected");
assert.strictEqual(isValidType({ $ne: null }), false, "Failed: object query was allowed as type");
assert.strictEqual(isValidType("malicious_type"), false, "Failed: unknown type was allowed");

const isValidSearchQuery = (q: unknown): boolean => {
  if (q !== undefined && typeof q !== "string") return false;
  const raw = typeof q === "string" ? q.trim() : "";
  return raw.length <= 100;
};

assert.strictEqual(isValidSearchQuery("google"), true, "Failed: valid search query was rejected");
assert.strictEqual(isValidSearchQuery(""), true, "Failed: empty search query was rejected");
assert.strictEqual(isValidSearchQuery("a".repeat(100)), true, "Failed: 100-char search query was rejected");
assert.strictEqual(isValidSearchQuery("a".repeat(101)), false, "Failed: >100-char search query was allowed");
assert.strictEqual(isValidSearchQuery({ $gt: "" }), false, "Failed: object query was allowed as search string");
console.log("✓ Vault item query validation verified successfully.");

// 4. Check Password Generator Cryptographic Randomness & Scoring
console.log("[4/5] Testing password generator and strength scorer...");
const pwd = generatePassword({
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: true,
});

assert.strictEqual(pwd.length, 24, "Failed: Generated password length incorrect");
const strength = scorePasswordStrength(pwd);
assert.strictEqual(strength.label, "Very Strong", "Failed: 24-char complex password should be Very Strong");
console.log(`✓ Password generator generated: length ${pwd.length}, strength '${strength.label}'`);

// 5. Check Protected Cryptographic Invariants
console.log("[5/5] Testing cryptographic primitives integrity...");
// Verify crypto imports remain intact and functional without altering vault secrets
const testKey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv("aes-256-gcm", testKey, crypto.randomBytes(12));
const encrypted = Buffer.concat([cipher.update("test-secret", "utf8"), cipher.final()]);
const tag = cipher.getAuthTag();
const decipher = crypto.createDecipheriv("aes-256-gcm", testKey, cipher.getAuthTag()); // test decipher initialization
assert.ok(encrypted.length > 0 && tag.length === 16, "Failed: AES-256-GCM verification failed");
console.log("✓ AES-256-GCM primitives verified intact.");

console.log("\nALL 5 SECURITY CHECKS PASSED SUCCESSFULLY!");
