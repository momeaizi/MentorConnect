import type { Config } from "tailwindcss";



export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#FAFAFA',
        secondary: '#70707B',
      },
    },
  },
  plugins: [],
} satisfies Config;
