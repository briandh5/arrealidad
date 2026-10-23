/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        tonal: 'var(--tonal)',
        ink: 'var(--ink)',
        ink2: 'var(--ink-2)',
        line: 'var(--line)',
        primary: 'var(--primary)',
        onTonal: 'var(--on-tonal)',
        ok: 'var(--ok)',
        star: 'var(--star)',
      },
      fontFamily: {
        display: ['"Google Sans Flex"', '"Google Sans"', 'Roboto', 'system-ui', 'sans-serif'],
        sans: ['Roboto', '"Google Sans Flex"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        e1: '0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        e3: '0 4px 8px 3px rgba(60,64,67,.15), 0 1px 3px rgba(60,64,67,.3)',
      },
    },
  },
  plugins: [],
}
