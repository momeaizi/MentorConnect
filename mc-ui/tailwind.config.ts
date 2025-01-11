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
      screens: {
        'h-sm': { raw: '(max-height: 640px)' },
        'h-md': { raw: '(max-height: 800px)' },
        'h-lg': { raw: '(min-height: 801px)' },
      },
    },
  },
  plugins: [],
} satisfies Config;
