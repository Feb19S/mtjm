import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0d0d11",
          900: "#131318",
          850: "#181820",
          800: "#1e1e28",
          700: "#2a2a36",
          600: "#383846",
          500: "#4d4d5e",
          400: "#6f6f82",
          300: "#9c9cab",
          200: "#c8c8d2",
          100: "#eceae4",
        },
        gold: {
          600: "#a6863f",
          500: "#c9a961",
          400: "#d9c07e",
          300: "#e7d6a6",
        },
      },
      fontFamily: {
        serif: ['"Songti SC"', "SimSun", "Georgia", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
