/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "henny-penny": ['"Henny Penny"', "serif"],
        "sour-gummy": ['"Sour Gummy"', "serif"],
      },
    },
  },
  plugins: [],
};
