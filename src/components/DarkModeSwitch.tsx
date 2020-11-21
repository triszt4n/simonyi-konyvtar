import { useColorMode, IconButton, ChakraProps } from "@chakra-ui/react"
import { HiMoon, HiSun } from "react-icons/hi"

export const DarkModeSwitch = (props: ChakraProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  return (
    <IconButton
      aria-label="Téma megváltoztatása"
      icon={isDark ? <HiMoon /> : <HiSun />}
      onClick={toggleColorMode}
      {...props}
    />
  )
}
