/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./renderer/pages/**/*.{js,ts,jsx,tsx}", "./renderer/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px"
    },
    extend: {
      colors: {
        "scrollbar-bg": "#f6f8fa",
        "scrollbar-thumb": "#888"
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" }
        }
      },
      animation: {
        blink: "blink 1s linear infinite"
      },
      scrollbar: theme => ({
        thin: {
          width: "4px", // 스크롤바 너비 조절
          "scrollbar-thumb": {
            backgroundColor: theme("colors.scrollbar-thumb"), // 스크롤바 색상 조절
            "&:hover": { backgroundColor: theme("colors.scrollbar-thumb") } // 마우스 호버 시 색상 유지
          },
          "scrollbar-track": { backgroundColor: theme("colors.scrollbar-bg") } // 스크롤 트랙(스크롤바 배경) 색상 조절
        }
      })
    }
  },
  plugins: [require("tailwind-scrollbar")]
}
