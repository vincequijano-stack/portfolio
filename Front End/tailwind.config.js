/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ig: {
          border: '#DBDBDB',
          lightBorder: '#EFEFEF',
          bg: '#FAFAFA',
          subtle: '#8E8E8E',
          blue: '#0095F6',
          blueHover: '#1877F2',
          dark: '#262626',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
