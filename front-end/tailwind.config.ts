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
      },
      // backgroundImage: {
      //   'hero-pattern': "url('/public/dark_background.jpg')",
      //   'footer-texture': "url('/public/dark_background.jpg')",
      // },
    },
  },
  plugins: [],
};
export default config;


