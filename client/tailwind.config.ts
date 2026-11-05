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
        navy:       "#1E1F4B",
        coral:      "#F26B4E",
        yellow:     "#F5C518",
        cream:      "#FDF6EC",
        "cream-dark": "#F5EDD8",
      },
      fontFamily: {
        sans: ["Inter", "Hind Siliguri", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
