/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FCD34D', // JoJo 主色
          dark: '#1F2937',   // 深色背景
        }
      }
    },
  },
  plugins: [],
}