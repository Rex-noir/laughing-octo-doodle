import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "selector",
  plugins: [
    // eslint-disable-next-line no-undef
    require("@tailwindcss/typography"),
    plugin(function ({ addComponents }) {
      addComponents({
        ".main-layout-rows": {
          gridTemplateRows: "80px minmax(500px,1fr) auto",
        },
        ".main-layout-col": {
          gridTemplateColumns: "1fr 2fr",
        },
        ".forecast-layout-row": {
          gridTemplateRows: "20px clamp(80px, 500px, 1fr)",
        },
        ".forecast-items-container-col": {
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        },
        ".header-columns": {
          gridTemplateColumns: "2fr 1fr",
        },
      });
    }),
  ],
};
