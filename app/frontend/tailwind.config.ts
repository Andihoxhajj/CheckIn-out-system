import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1d4ed8',
          light: '#60a5fa',
          dark: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

