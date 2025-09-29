/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#667eea',
          600: '#764ba2',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        success: {
          light: '#48bb78',
          main: '#38a169',
          dark: '#2f855a',
        },
        danger: {
          light: '#fc8181',
          main: '#f56565',
          dark: '#c53030',
        },
        warning: {
          light: '#f6ad55',
          main: '#f39c12',
          dark: '#c05621',
        },
        info: {
          light: '#63b3ed',
          main: '#3182ce',
          dark: '#2c5282',
        },
        categories: {
          salary: '#48bb78',
          food: '#f6ad55',
          transport: '#4299e1',
          housing: '#ed8936',
          entertainment: '#9f7aea',
          healthcare: '#ed64a6',
          shopping: '#4299e1',
          utilities: '#667eea',
          savings: '#38a169',
          other: '#718096',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}