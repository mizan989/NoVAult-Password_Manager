import { api } from "./api";
import { VaultItem, VaultItemType, VaultItemData, GeneratorOptions, PasswordStrength } from "../types";

export const vaultService = {
  async list(type?: VaultItemType) {
    const { data } = await api.get("/vault", { params: type ? { type } : {} });
    return data.data as VaultItem[];
  },

  async search(query: string) {
    const { data } = await api.get("/vault/search", { params: { q: query } });
    return data.data as VaultItem[];
  },

  async create(type: VaultItemType, category: string, favourite: boolean, itemData: VaultItemData) {
    const { data } = await api.post("/vault", { type, category, favourite, data: itemData });
    return data.data as VaultItem;
  },

  async update(id: string, updates: Partial<{ category: string; favourite: boolean; data: VaultItemData }>) {
    const { data } = await api.put(`/vault/${id}`, updates);
    return data.data as VaultItem;
  },

  async remove(id: string) {
    await api.delete(`/vault/${id}`);
  },

  async generatePassword(options: GeneratorOptions) {
    const { data } = await api.post("/generate-password", options);
    return data.data as { password: string; strength: PasswordStrength };
  },
};
