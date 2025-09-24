/** @type {{content: string[], theme: any, plugins: any[]}} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#134231",
          gold: "#B39449",
          paper: "#E9E8DB"
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.15)"
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
