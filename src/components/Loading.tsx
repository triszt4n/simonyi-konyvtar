import { Center, Flex, Spinner, Text } from "@chakra-ui/react"

export default function Loading() {
  return (
    <Center>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="green.500"></Spinner>
        <Text mt={2}>Betöltés...</Text>
      </Flex>
    </Center>
  )
}
