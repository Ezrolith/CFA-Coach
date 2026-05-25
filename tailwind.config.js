/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c0',
          400: '#8a8a94',
          500: '#5e5e68',
          600: '#3f3f47',
          700: '#27272d',
          800: '#18181c',
          900: '#0c0c0f',
          950: '#050507',
        },
        accent: {
          50:  '#eef4ff',
          100: '#d9e6ff',
          200: '#b9d2ff',
          300: '#8bb4ff',
          400: '#5a8eff',
          500: '#3a6bf5',
          600: '#264fdb',
          700: '#1f3eb0',
          800: '#1d378e',
          900: '#1d3274',
        },
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '0.01em' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
        'base': ['1rem',     { lineHeight: '1.5rem',  letterSpacing: '0' }],
        'lg':   ['1.125rem', { lineHeight: '1.625rem',letterSpacing: '-0.005em' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem',    letterSpacing: '-0.015em' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem',  letterSpacing: '-0.025em' }],
        '5xl':  ['3rem',     { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],
        '6xl':  ['3.75rem',  { lineHeight: '4rem',    letterSpacing: '-0.035em' }],
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
