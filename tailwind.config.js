/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ballstate: {
          red: '#CC0000',
          white: '#FFFFFF',
          gray: '#666666'
        },
        gray: {
          750: '#2D3748', // Custom intermediate gray for dark mode
          850: '#1A202C', // Custom dark gray for dark mode
        }
      },
    },
  },
  plugins: [],
}