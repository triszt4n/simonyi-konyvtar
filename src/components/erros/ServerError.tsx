import { Heading } from "@chakra-ui/core"
import { Flex, Image } from "@chakra-ui/core"

const ServerError = () => {
  return (
    <Flex direction="column" mx="auto" alignItems="center">
      <Heading as="h1">Belső szerverhiba</Heading>
      <Image src="https://http.cat/500" />
    </Flex>
  )
}

export default ServerError
