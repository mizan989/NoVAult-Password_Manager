import axios from "axios";

let inMemoryAccessToken: string | null = null;

export function getAuthToken(): string | null {
  return inMemoryAccessToken;
}

export function setAuthToken(token: string | null) {
  inMemoryAccessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "https://novault-mizan.onrender.com/api" : "/api",
  withCredentials: true,
});

// Attach Authorization header if token present in memory
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
];

// Auto-refresh the access token once on a 401 for authenticated requests using HttpOnly cookie.
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
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
