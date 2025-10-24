import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFC700",
          '50': '#FFFBEB',
          '100': '#FFF6C5',
          '200': '#FFEC8A',
          '300': '#FFE04D',
          '400': '#FFD41A',
          '500': '#FFC700',
          '600': '#E6B300',
          '700': '#B38B00',
          '800': '#806400',
          '900': '#4D3C00',
        },
        "background-light": "#F9F9F9",
        "background-dark": "#121212",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1C1C1C",
        "text-light": "#18181B",
        "text-dark": "#E4E4E7",
        "subtle-light": "#71717A",
        "subtle-dark": "#A1A1AA",
        "border-light": "#E4E4E7",
        "border-dark": "#27272A"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': "0.75rem",
        'xl': "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'soft-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};

export default config;