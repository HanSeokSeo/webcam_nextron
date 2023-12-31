import StyledButton from "@components/button/StyledButton"
import ThemeSwitch from "./ThemeSwitch"

const TopBar = () => {
  return (
    <div className="h-[5%] w-full flex items-center justify-end pr-2 border-slate-500 border-x-2 border-t-2">
        <StyledButton buttonText="View Patients"/>
        <ThemeSwitch />
    </div>
  )
}

export default TopBar
