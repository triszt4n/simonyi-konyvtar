import { useColorMode, IconButton } from "@chakra-ui/core"

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  return (
    <IconButton
      aria-label="Change color theme"
      icon={isDark ? "moon" : "sun"}
      onClick={toggleColorMode}
    />
  )
}
