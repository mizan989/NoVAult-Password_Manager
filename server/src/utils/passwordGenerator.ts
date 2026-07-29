import crypto from "crypto";

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean; // excludes il1Lo0O
}

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similar: "il1Lo0O",
};

export function generatePassword(options: GeneratorOptions): string {
  const { length, uppercase, lowercase, numbers, symbols, excludeSimilar } = options;

  let charset = "";
  if (uppercase) charset += SETS.uppercase;
  if (lowercase) charset += SETS.lowercase;
  if (numbers) charset += SETS.numbers;
  if (symbols) charset += SETS.symbols;

  if (excludeSimilar) {
    charset = charset
      .split("")
      .filter((c) => !SETS.similar.includes(c))
      .join("");
  }

  if (!charset) {
    throw new Error("At least one character set must be selected");
  }

  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

export function scorePasswordStrength(password: string): {
  score: number; // 0-4
  label: "Weak" | "Medium" | "Strong" | "Very Strong";
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  const labels: Array<"Weak" | "Medium" | "Strong" | "Very Strong"> = [
    "Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ];
  return { score: clamped, label: labels[clamped] };
}
