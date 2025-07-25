/** @type {import('tailwindcss').Config} */

import flowbite from "flowbite-react/tailwind"; // Import Flowbite plugin

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(), // Add Flowbite content paths
    "./src/**/*.css"
  ],
  theme: {
    extend: {
      boxShadow: {
        "custom-shadow": `
          0px 2.71px 4.4px 0px #C0C0C007,
          0px 6.86px 11.12px 0px #C0C0C00A,
          0px 14px 22.68px 0px #C0C0C00C,
          0px 28.84px 46.72px 0px #C0C0C00F,
          0px 79px 128px 0px #C0C0C017,
          0px -4px 4px 0px #C0C0C017
        `,
        'soft': '0 0 12px 0 rgba(0, 0, 0, 0.08)',
      },
      screens: {
        "2xl": "1920px", // existing by default (you can override or keep it)
        "3xl": "1920px", // custom breakpoint if you need another name
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            textShadow: "0 0 10px #FACC15, 0 0 20px #38bdf8",
            color: "#4B5563",
          },
          "50%": {
            textShadow: "0 0 20px #FFBF00, 0 0 30px #0ea5e9",
            color: "#374151",
          },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite",
      },
    }, // Add any theme extensions here
  },
  plugins: [
    flowbite.plugin(), // Include the Flowbite plugin
  ],
};
