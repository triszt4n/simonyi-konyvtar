import { CircularProgress, Flex, Text } from "@chakra-ui/core"

export default function Loading() {
  return (
    <Flex
      alignItems="center"
      w="100%"
      flex={1}
      justifyContent="center"
      direction="column"
    >
      <CircularProgress isIndeterminate color="green"></CircularProgress>
      <Text mt={2}>Betöltés...</Text>
    </Flex>
  )
}
