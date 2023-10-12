/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./renderer/pages/**/*.{js,ts,jsx,tsx}", "./renderer/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "scrollbar-bg": "#f6f8fa",
        "scrollbar-thumb": "#888"
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
