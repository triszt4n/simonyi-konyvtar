import { Flex, Heading } from "@chakra-ui/react"
import NextImage from "next/image"

const NotFound = () => {
  return (
    <Flex direction="column" mx="auto" alignItems="center">
      <Heading as="h1">Az oldal nem található</Heading>
      <NextImage src="https://http.cat/404" width={500} height={400} />
    </Flex>
  )
}

export default NotFound
