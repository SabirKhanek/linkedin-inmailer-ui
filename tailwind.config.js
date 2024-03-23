const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        // blue: "#039BE5",
        // black: "#0D131D",
        // grey: "#8A9099",
        // "light-grey": "#E2E6ED",
        "bluer-white": "#F6F9FF",
        primary: "#1D3058",
        highlight: "#1D3058", // #35837F
        label: "#727272",
        disable: "#BAC3D6",
        bdr: "#EEF2FA",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["winter", "night"],
  },
  darkMode: ["class", '[data-theme="night"]'],
};
