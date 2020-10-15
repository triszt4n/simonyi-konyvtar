import { Heading } from "@chakra-ui/core"
import { Flex, Image } from "@chakra-ui/core"

const NotFound = () => {
  return (
    <Flex direction="column" mx="auto" alignItems="center">
      <Heading as="h1">Az oldal nem található</Heading>
      <Image src="https://http.cat/404" />
    </Flex>
  )
}

export default NotFound
