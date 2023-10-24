import { useTheme } from "next-themes"
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
<button
  onClick={toggleTheme}
  className="p-2 px-2 text-sm text-gray-700 dark:bg-green-500 dark:bg-opacity-20 dark:text-gray-50 flex items-center bg-gray-200 rounded"
>
  {isDarkMode? (
    <>
      <FaSun className="mr-1" />
      Light
    </>
  ) : (
    <>
          <FaMoon className="mr-1" />
      Dark

    </>
  )}
</button>
  )
}

export default ThemeSwitch
