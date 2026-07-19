import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F4EC",
          soft: "#FBF9F3",
          deep: "#EFEADC",
        },
        sage: {
          50: "#EFF3ED",
          100: "#DCE4D8",
          200: "#BFCDB9",
          300: "#A2B79B", // logo green, lightened
          400: "#8AA382",
          500: "#71896A", // primary interactive
          600: "#5B6F55",
          700: "#475843",
          800: "#34402F", // deep headings / dark sections
          900: "#222B1F",
        },
        clay: {
          50: "#FBF2E8",
          100: "#F4DFC4",
          200: "#E8C49A",
          300: "#D8A877", // logo tan, lightened
          400: "#C9925E", // accent / badges
          500: "#B27A47", // price / links on light bg
          600: "#93613A",
          700: "#744B2E",
          800: "#553622",
          900: "#382316",
        },
        ink: {
          DEFAULT: "#2A2E26",
          soft: "#666C5E",
          faint: "#9A9F8F",
        },
        line: "#E3DECF",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 16px -4px rgba(42, 46, 38, 0.08)",
        soft: "0 1px 3px rgba(42, 46, 38, 0.06)",
        lift: "0 18px 40px -16px rgba(42, 46, 38, 0.25)",
      },
      maxWidth: {
        wrap: "1280px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
