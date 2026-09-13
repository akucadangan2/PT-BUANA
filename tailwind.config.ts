import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        canvas: "#F7F8FA",
        surface: "#FFFFFF",
        primary: { DEFAULT: "#0F6E6E", light: "#E6F2F1" },
        amber: { DEFAULT: "#C77D1F", light: "#FBF0DF" },
        danger: "#C0442E",
        success: "#2F8F5B",
        line: "#E2E5EA",
        muted: "#667085",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;