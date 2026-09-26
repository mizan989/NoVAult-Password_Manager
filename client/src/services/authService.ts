import { api, setAuthToken } from "./api";
import { User } from "../types";

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data.data as { email: string };
  },

  async verifyOtp(email: string, code: string) {
    const { data } = await api.post("/auth/verify-otp", { email, code });
    if (data.data?.accessToken) {
      setAuthToken(data.data.accessToken);
    }
    return data.data as { user: User; accessToken?: string };
  },

  async login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.data?.accessToken) {
      setAuthToken(data.data.accessToken);
    }
    return data.data as { user: User; accessToken?: string };
  },

  async googleAuth(idToken: string) {
    const { data } = await api.post("/auth/google", { idToken });
    if (data.data?.accessToken) {
      setAuthToken(data.data.accessToken);
    }
    return data.data as { user: User; accessToken?: string };
  },

  async me() {
    const { data } = await api.get("/auth/me");
    return data.data as User;
  },

  async updateName(name: string) {
  const { data } = await api.put("/auth/me", { name });
  return data.data as { name: string };
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setAuthToken(null);
    }
  },

  async createMasterPassword(authHash: string, salt?: string) {
    const { data } = await api.post("/auth/master-password", { authHash, salt });
    return data.data as { hasMasterPassword: boolean; salt?: string };
  },

  async verifyMasterPassword(authHash: string) {
    const { data } = await api.post("/auth/master-password/verify", { authHash });
    return data.data as { unlocked: boolean };
  },
};
