/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a4d6c",
          dark: "#083a52",
          light: "#0c5a7f",
        },
        secondary: {
          DEFAULT: "#e65c00",
          dark: "#cc5000",
          light: "#ff6600",
        },
        background: "#f8fafc",
        card: "#ffffff",
        text: {
          DEFAULT: "#333333",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
