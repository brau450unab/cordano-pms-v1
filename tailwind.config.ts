import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cordano: {
          burgundy: "#80093A",
          hover: "#A52C55",
          subtle: "rgba(128, 9, 58, 0.12)",
          surface: "#F9F9FB",
          dark: "#1A1C1D",
          50: "#fff1f4",
          100: "#ffe4ea",
          200: "#fecdd7",
          300: "#fea3b6",
          400: "#fb6f8e",
          500: "#f43f68",
          600: "#e11d48",
          700: "#be123c",
          800: "#80093A",
          900: "#4c0522",
        },
        slot: {
          available: "#10B981",
          occupied: "#64748B",
          reserved: "#F59E0B",
          subscriber: "#3B82F6",
          pmr: "#06B6D4",
          ev: "#8B5CF6",
          overstay: "#EF4444",
        }
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "Geist Mono", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
