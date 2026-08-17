import axios from "axios";

const TOKEN_KEY = "novault_access_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common["Authorization"];
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

// Attach Authorization header and dynamic master password header to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Attach the derived master password (session-only, kept in memory - see useVaultUnlock)
// as a header for any vault request. This is set dynamically, never persisted to storage.
export function setVaultUnlockHeader(masterPassword: string | null) {
  if (masterPassword) {
    api.defaults.headers.common["x-master-password"] = masterPassword;
  } else {
    delete api.defaults.headers.common["x-master-password"];
  }
}

// Auto-refresh the access token once on a 401, then retry the original request.
let isRefreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh");
        if (data.data?.accessToken) {
          setAuthToken(data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        }
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        setAuthToken(null);
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
