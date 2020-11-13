import { Flex, Spinner, Text } from "@chakra-ui/react"

export default function Loading() {
  return (
    <Flex
      alignItems="center"
      w="100%"
      flex={1}
      justifyContent="center"
      direction="column"
    >
      <Spinner color="green"></Spinner>
      <Text mt={2}>Betöltés...</Text>
    </Flex>
  )
}
