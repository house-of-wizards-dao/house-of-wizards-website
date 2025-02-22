import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      xs: ['10px', '14px'],
      sm: ['12px', '16px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '32px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '36px'],
      '4xl': ['36px', '40px'],
      '5xl': ['48px', '1'],
      '6xl': ['60px', '1'],
      '7xl': ['89px', '1'],
      '8xl': ['96px', '1'],
      '8xl': ['128px', '1'],
    },
    extend: {
      fontFamily: {
        sans: ['Mona Sans', 'sans-serif'],
        mono: ["var(--font-mono)"],
        atirose: ['Atirose', 'sans-serif'],
        ocra: ['OCRAStd', 'sans-serif']
      },
      colors: {
        violet: '#A986D9',
        darkviolet: '#4D3E63',
        green: '#AAC764',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
