import dotenv from "dotenv";
dotenv.config();

function get(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: get("CLIENT_URL", "http://localhost:5173"),

  mongoUri: get("MONGO_URI", "mongodb://localhost:27017/novault"),

  jwtAccessSecret: get("JWT_ACCESS_SECRET", "dev_access_secret_change_me"),
  jwtRefreshSecret: get("JWT_REFRESH_SECRET", "dev_refresh_secret_change_me"),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",

  cookieSecret: get("COOKIE_SECRET", "dev_cookie_secret_change_me"),

  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  resendApiKey: process.env.RESEND_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "NoVAult <noreply@novault.app>",

  encryptionPepper: get(
    "ENCRYPTION_PEPPER",
    "0000000000000000000000000000000000000000000000000000000000"
  ),

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),

  isProd: process.env.NODE_ENV === "production",
};

if (env.isProd) {
  const insecureDefaults = [
    { key: "JWT_ACCESS_SECRET", val: env.jwtAccessSecret, defaultVal: "dev_access_secret_change_me" },
    { key: "JWT_REFRESH_SECRET", val: env.jwtRefreshSecret, defaultVal: "dev_refresh_secret_change_me" },
    { key: "COOKIE_SECRET", val: env.cookieSecret, defaultVal: "dev_cookie_secret_change_me" },
    {
      key: "ENCRYPTION_PEPPER",
      val: env.encryptionPepper,
      defaultVal: "0000000000000000000000000000000000000000000000000000000000",
    },
  ];

  for (const item of insecureDefaults) {
    if (!item.val || item.val === item.defaultVal) {
      throw new Error(`[NoVAult Security] ${item.key} must be configured with a secure value in production.`);
    }
  }
} else if (env.encryptionPepper === "0000000000000000000000000000000000000000000000000000000000") {
  console.warn("[NoVAult Security Warning] Using default ENCRYPTION_PEPPER in development. Set ENCRYPTION_PEPPER in .env before deploying.");
}
