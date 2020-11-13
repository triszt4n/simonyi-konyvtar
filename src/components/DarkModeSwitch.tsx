import { useColorMode, IconButton } from "@chakra-ui/react"
import { HiMoon, HiSun } from "react-icons/hi"

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  return (
    <IconButton
      aria-label="Change color theme"
      icon={isDark ? <HiMoon /> : <HiSun />}
      onClick={toggleColorMode}
    />
  )
}
