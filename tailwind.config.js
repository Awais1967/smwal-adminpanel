/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        45: "45px",
        55: "55px",
        105: "105px",
        130: "130px",
        140: "140px",
        160: "160px",
        190: "190px",
        195: "195px",
        205: "205px",
        215: "215px",
        230: "230px",
        295: "295px",
      },
      height: {
        160: "160px",
      },
    },
  },
  plugins: [],
};
