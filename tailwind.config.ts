import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-banner": "rgb(240, 240, 249)",
        "bg-main": "#fffefb",
        "btn-main": "#d9ddf6",
        "btn-orange": "#ff9152",
        "yellow-light": "#FDF9EE",
        "txt-blue": "#141361",
      },
    },
  },
  plugins: [],
};
export default config;
