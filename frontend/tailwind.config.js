/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sbi: {
          blue: '#002E6E',
          cyan: '#00A3E0',
          dark: '#0A192F',
        }
      }
    },
  },
  plugins: [],
}