import { api } from "./api";
import { VaultItem, VaultItemType, VaultItemData, GeneratorOptions, PasswordStrength } from "../types";
import { encryptVaultItem, decryptVaultItem, getActiveCryptoKey } from "../utils/crypto";
import { generateSecurePassword } from "../utils/cryptoGenerator";
import { scorePasswordStrength } from "../utils/passwordStrength";

export const vaultService = {
  async list(type?: VaultItemType): Promise<VaultItem[]> {
    const { data } = await api.get("/vault", { params: type ? { type } : {} });
    const key = getActiveCryptoKey();
    if (!key) return [];

    const decrypted = await Promise.all(
      (data.data || []).map(async (item: any) => {
        try {
          const itemData = await decryptVaultItem(
            { ciphertext: item.ciphertext, iv: item.iv, authTag: item.authTag },
            key
          );
          return {
            id: item.id || item._id,
            type: item.type,
            category: item.category,
            favourite: item.favourite,
            data: itemData as VaultItemData,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          } as VaultItem;
        } catch {
          return {
            id: item.id || item._id,
            type: item.type,
            category: item.category,
            favourite: item.favourite,
            data: { title: "Corrupted Record" },
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          } as VaultItem;
        }
      })
    );
    return decrypted;
  },

  async search(query: string): Promise<VaultItem[]> {
    const items = await this.list();
    const q = query.toLowerCase();
    return items.filter((item) => {
      const haystack =
        JSON.stringify(item.data).toLowerCase() + (item.category || "").toLowerCase();
      return haystack.includes(q);
    });
  },

  async create(type: VaultItemType, category: string, favourite: boolean, itemData: VaultItemData): Promise<VaultItem> {
    const key = getActiveCryptoKey();
    if (!key) throw new Error("Vault is locked. Unlock before creating items.");

    const payload = await encryptVaultItem(itemData, key);
    const { data } = await api.post("/vault", {
      type,
      category,
      favourite,
      ciphertext: payload.ciphertext,
      iv: payload.iv,
      authTag: payload.authTag,
    });

    return {
      id: data.data.id || data.data._id,
      type,
      category,
      favourite,
      data: itemData,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };
  },

  async update(id: string, updates: Partial<{ category: string; favourite: boolean; data: VaultItemData }>): Promise<VaultItem> {
    const body: Record<string, unknown> = {};
    if (updates.category !== undefined) body.category = updates.category;
    if (updates.favourite !== undefined) body.favourite = updates.favourite;

    if (updates.data) {
      const key = getActiveCryptoKey();
      if (!key) throw new Error("Vault is locked. Unlock before updating items.");
      const payload = await encryptVaultItem(updates.data, key);
      body.ciphertext = payload.ciphertext;
      body.iv = payload.iv;
      body.authTag = payload.authTag;
    }

    const { data } = await api.put(`/vault/${id}`, body);

    return {
      id: data.data.id || data.data._id,
      type: data.data.type,
      category: data.data.category,
      favourite: data.data.favourite,
      data: updates.data || {},
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/vault/${id}`);
  },

  async generatePassword(options: GeneratorOptions): Promise<{ password: string; strength: PasswordStrength }> {
    // Generate securely client-side without network leakage
    const password = generateSecurePassword(options);
    const strength = scorePasswordStrength(password);
    return { password, strength };
  },
};
