/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // We will toggle 'dark' class on the body or html tag
  theme: {
    extend: {
      colors: {
        fivia: {
          light: '#d8f0e8',
          DEFAULT: '#249b81',
          dark: '#0e4e3c',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
