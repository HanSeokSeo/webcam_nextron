import React from "react"
import type { AppProps } from "next/app"
import "../styles/globals.css"
import { ThemeProvider } from "next-themes"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 dark:text-white text-black">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
