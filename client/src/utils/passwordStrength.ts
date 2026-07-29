import { PasswordStrength } from "../types";

export function scorePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  const labels: PasswordStrength["label"][] = ["Weak", "Weak", "Medium", "Strong", "Very Strong"];
  return { score: clamped, label: labels[clamped] };
}

export function strengthColor(label: PasswordStrength["label"]) {
  switch (label) {
    case "Weak":
      return "bg-red-400";
    case "Medium":
      return "bg-yellow-400";
    case "Strong":
      return "bg-blue-400";
    case "Very Strong":
      return "bg-green-500";
  }
}
