/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.html", "./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        telegram: {
          default: "#0088CC",
          light: "#179CDE",
        },
      },
    },
  },
  plugins: [],
};
