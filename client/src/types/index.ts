export interface User {
  id: string;
  name: string;
  email: string;
  provider?: "email" | "google" | "both";
  hasMasterPassword: boolean;
}

export type VaultItemType = "password" | "note" | "card" | "identity" | "apikey";

export interface VaultItemData {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  content?: string; // for secure notes
  [key: string]: unknown;
}

export interface VaultItem {
  id: string;
  type: VaultItemType;
  category: string;
  favourite: boolean;
  data: VaultItemData;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}

export interface PasswordStrength {
  score: number;
  label: "Weak" | "Medium" | "Strong" | "Very Strong";
}
