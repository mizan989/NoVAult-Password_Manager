/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#F8FAFC",          // Light porcelain / slate-50
          canvas: "#F1F5F9",      // Slightly darker section background
          surface: "#FFFFFF",     // Pure white card
          surfaceHover: "#F8FAFC",
          border: "#E2E8F0",      // Slate-200 border
          borderLight: "#F1F5F9", // Slate-100 border
          text: "#0F172A",        // Slate-900 high contrast
          muted: "#64748B",       // Slate-500
          subtle: "#94A3B8",      // Slate-400
          accent: "#3B82F6",      // Radiant cobalt blue
          accentHover: "#2563EB",
          accentSoft: "#EFF6FF",  // Blue-50
          accentBorder: "#BFDBFE",// Blue-200
          indigo: "#4F46E5",
          indigoSoft: "#EEF2FF",
          emerald: "#10B981",
          emeraldSoft: "#ECFDF5",
          amber: "#F59E0B",
          amberSoft: "#FFFBEB",
          danger: "#EF4444",
          dangerSoft: "#FEF2F2",
          dangerBorder: "#FECACA",
        },
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        card: "0 10px 30px -4px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
        glow: "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        glowEmerald: "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        float: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

