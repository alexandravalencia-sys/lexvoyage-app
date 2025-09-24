/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0E3A2F",
          gold: "#B39449",
          paper: "#FAF9F6"
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.12)"
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
