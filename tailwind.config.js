import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        garden: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        leaf: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        soil: {
          50: '#faf5f0',
          100: '#f0e6d8',
          200: '#e0ccb0',
          300: '#c9a97c',
          400: '#b38b52',
          500: '#9a7342',
          600: '#7d5a35',
          700: '#5f442a',
          800: '#453220',
          900: '#2d2116',
        },
      },
      backgroundImage: {
        'gradient-garden': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ecfdf5 100%)',
        'gradient-leaf': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
