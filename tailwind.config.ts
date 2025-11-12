import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
      },
      boxShadow: {
        soft: '0 4px 12px rgba(163, 159, 159, 0.05)',
      },
    },
  },
};
export default config;
