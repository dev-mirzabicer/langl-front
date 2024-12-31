/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // optional
    require("daisyui"), // optional
  ],
  daisyui: {
    // optional DaisyUI config
    themes: ["light", "dark"],
  },
};
