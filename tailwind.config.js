/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      colors: {
        ink: "#111111",
        mist: "#f4f4f2",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
