/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary:"#FFCE1A",
          secondary:"#0D0842",
          blackBG:"#F3F3F3",
          favourite:"#FF5841",
          white:"#ffffff",
        },
        fontFamily: {
          primary: ["Montserrat", "sans-serif"],
          secondary: ["Nunito Sans", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  
  export default tailwindConfig;
  