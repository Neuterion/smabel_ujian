const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      'inter': 'Inter, sans-serif',
    },
    screens: {
      'xs': '360px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}
