import { useColorMode, Icon, ChakraProps } from "@chakra-ui/react"
import { HiMoon, HiSun } from "react-icons/hi"

export const DarkModeSwitch = (props: ChakraProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  return (
    <Icon
      aria-label="Téma megváltoztatása"
      cursor="pointer"
      as={isDark ? HiMoon : HiSun}
      onClick={toggleColorMode}
      {...props}
    />
  )
}
