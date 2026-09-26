import axios from "axios";

let inMemoryAccessToken: string | null = null;

export function getAuthToken(): string | null {
  return inMemoryAccessToken || localStorage.getItem("novault_access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("novault_refresh_token");
}

export function setAuthToken(token: string | null, refreshToken?: string | null) {
  inMemoryAccessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("novault_access_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("novault_access_token");
  }

  if (refreshToken !== undefined) {
    if (refreshToken) {
      localStorage.setItem("novault_refresh_token", refreshToken);
    } else {
      localStorage.removeItem("novault_refresh_token");
    }
  }
}

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "https://novault-mizan.onrender.com/api" : "/api",
  withCredentials: true,
});

// Attach Authorization header if token present
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Auto-refresh the access token once on a 401 for authenticated requests.
// Supports both HttpOnly cookies and cross-origin body refresh token fallback.
let isRefreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (isPublicAuthRoute) {
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
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
