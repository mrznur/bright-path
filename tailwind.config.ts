import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    // brand backgrounds used dynamically
    "bg-brand-yellow", "bg-brand-blue", "bg-brand-purple", "bg-brand-green", "bg-brand-red",
    "bg-brand-blue-light", "bg-brand-purple-light", "bg-brand-green-light", "bg-brand-red-light",
    "bg-brand-yellow-light", "bg-brand-gray",
    // text colors used dynamically
    "text-brand-blue", "text-brand-purple", "text-brand-green", "text-brand-red",
    "text-brand-yellow",
    // border colors used dynamically
    "border-brand-blue", "border-brand-purple", "border-brand-green", "border-brand-red",
    "border-brand-yellow",
    // top strip colors on course card
    "bg-[#F5D000]", "bg-[#3366FF]", "bg-[#7C3AED]", "bg-[#22C55E]",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow:         "#F5D000",
          "yellow-light": "#FEFACC",
          blue:           "#3366FF",
          "blue-light":   "#EEF2FF",
          purple:         "#7C3AED",
          "purple-light": "#F5F0FF",
          green:          "#22C55E",
          "green-light":  "#F0FFF4",
          red:            "#EF4444",
          "red-light":    "#FFF5F5",
          gray:           "#F4F5F7",
          dark:           "#111111",
        },
        ink: {
          DEFAULT: "#111111",
          soft:    "#374151",
          mute:    "#6B7280",
          faint:   "#9CA3AF",
        },
        line:    "#E5E7EB",
        surface: "#F4F5F7",
      },
      fontFamily: {
        sans:   ["var(--font-sans)", "system-ui", "sans-serif"],
        bangla: ["var(--font-bangla)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        xl:   "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card:         "4px 4px 0px 0px #111111",
        "card-sm":    "2px 2px 0px 0px #111111",
        "card-lg":    "6px 6px 0px 0px #111111",
        "card-hover": "6px 6px 0px 0px #111111",
        soft: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,0,0,0.12)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
