import axios from "axios";

const TOKEN_KEY = "novault_access_token";
const REFRESH_TOKEN_KEY = "novault_refresh_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null, refreshToken?: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common["Authorization"];
    }

    if (refreshToken !== undefined) {
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  } catch {
    // Ignore localStorage errors in private mode
  }
}

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "https://novault-mizan.onrender.com/api" : "/api",
  withCredentials: true,
});

// Initialize Authorization header from existing token
const initialToken = getAuthToken();
if (initialToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

let currentMasterPassword: string | null = null;

// Attach Authorization header and dynamic master password header to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Scope master password strictly to vault endpoints to prevent leaking to auth/generator/health
  if (currentMasterPassword && config.url && config.url.includes("/vault")) {
    config.headers["x-master-password"] = currentMasterPassword;
  } else if (config.headers) {
    delete config.headers["x-master-password"];
  }
  return config;
});

// Update the in-memory master password for the current session
export function setVaultUnlockHeader(masterPassword: string | null) {
  currentMasterPassword = masterPassword;
}

// Public endpoints that should never trigger auto-refresh
const PUBLIC_AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/google",
  "/auth/refresh",
  "/auth/logout",
  "/auth/master-password",
];

// Auto-refresh the access token once on a 401 for authenticated requests only.
let isRefreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
    );

    const errorMessage = error.response?.data?.message;
    const isMasterPasswordError =
      typeof errorMessage === "string" &&
      (errorMessage.toLowerCase().includes("master password") ||
        errorMessage.toLowerCase().includes("vault is locked"));

    // If it's a login/register/google/master-password attempt that failed with 401,
    // or there's no stored token, or it's a master password error, do not attempt token refresh.
    if (isPublicAuthRoute || !getAuthToken() || isMasterPasswordError) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const fallbackRefreshToken = getRefreshToken();
        const { data } = await api.post("/auth/refresh", {
          refreshToken: fallbackRefreshToken || undefined,
        });
        if (data.data?.accessToken) {
          setAuthToken(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        }
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        setAuthToken(null, null);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
