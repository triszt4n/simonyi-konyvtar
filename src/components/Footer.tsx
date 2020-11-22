import { Flex, Text, Link } from "@chakra-ui/react"
import NextImage from "next/image"

const Footer: React.FC = () => (
  <Flex as="footer" pt={12} pb={6} direction="column" alignItems="center">
    <Text>Made with ❤️ by</Text>
    <Link href="https://simonyi.bme.hu" target="_blank">
      <NextImage src="/simonyi_color.svg" alt="simonyi logo" width="168" height="64" />
    </Link>
  </Flex>
)

export default Footer
