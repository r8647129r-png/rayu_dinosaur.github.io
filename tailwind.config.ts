import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8FAFC",
        forest: {
          DEFAULT: "#1B4332",
          dark: "#12301F",
          light: "#2D6A4F",
          pale: "#E8F0EC",
        },
        slate: {
          ink: "#334155",
        },
      },
      fontFamily: {
        sans: [
          "\"Hiragino Kaku Gothic ProN\"",
          "\"Hiragino Sans\"",
          "\"Noto Sans JP\"",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
