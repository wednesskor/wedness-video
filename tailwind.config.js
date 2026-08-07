/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        audiowide: ["var(--font-audiowide)", "sans-serif"],
        suit: ["SUIT", "sans-serif"],
      },
      colors: {
        "wedness-orange": "#ff682d",
        "wedness-orange-dark": "#f54b08",
        "wedness-orange-light": "#ffa32b",
      },
    },
  },
  plugins: [],
};
