import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["RubikMonoOne", "sans-serif"],
        rubik_medium: ["Rubik Medium", "sans-serif"],
        share: ["ShareTechMono", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        roboto_medium: ["Roboto Medium", "sans-serif"],
        roboto_bold: ["Roboto Bold", "sans-serif"],
        roboto_light: ["Roboto Light", "sans-serif"],
        roboto_thin: ["Roboto Thin", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
