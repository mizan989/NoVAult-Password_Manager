import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "https://novault-mizan.onrender.com/api" : "/api",
  withCredentials: true,
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
        await api.post("/auth/refresh");
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
