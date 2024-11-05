/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customTeal: 'rgb(85, 179, 164)',
         text: 'rgb(0 0 0)',
         
      },
    },
  },
  plugins: [],
};
