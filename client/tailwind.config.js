/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#FAFAFA",
          surface: "#FFFFFF",
          border: "#ECECEC",
          muted: "#8A8A8E",
          text: "#111113",
          accent: "#2F5CFF",
          accentSoft: "#EEF2FF",
          danger: "#E5484D",
        },
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      transitionDuration: {
        250: "250ms",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
