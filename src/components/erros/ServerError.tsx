import { Heading } from "@chakra-ui/react"
import { Flex, Image } from "@chakra-ui/react"

const ServerError = () => {
  return (
    <Flex direction="column" mx="auto" alignItems="center">
      <Heading as="h1">Belső szerverhiba</Heading>
      <Image src="https://http.cat/500" />
    </Flex>
  )
}

export default ServerError
