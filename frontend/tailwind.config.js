/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
    "node_modules/react-daisyui/dist/**/*.js",
    "node_modules/daisyui/dist/**/*.js",
  ],
  theme: {
    fontSize: {
      xxs: "0.6rem",
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {
      margin: {
        "-56px": "-56px",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#641ae6",

          secondary: "#d926a9",

          accent: "#1fb2a6",

          neutral: "#2a323c",

          "base-100": "#1d232a40",

          info: "#3abff8",

          success: "#36d399",

          warning: "#fbbd23",

          error: "#f87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
