import { Box, useColorMode, Icon, ChakraProps } from "@chakra-ui/react"
import { HiMoon, HiSun } from "react-icons/hi"

export const DarkModeSwitch = (props: ChakraProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  return (
    <Box
      p={2}
      onClick={toggleColorMode}
      cursor="pointer"
      rounded="md"
      _hover={{
        shadow: "md",
      }}
    >
      <Icon aria-label="Téma megváltoztatása" as={isDark ? HiMoon : HiSun} {...props} />
    </Box>
  )
}
