import { Flex, Text, Link } from "@chakra-ui/react"

const Footer: React.FC = (props) => (
  <Flex as="footer" py="3rem">
    <Text>
      Made with ❤️ by{" "}
      <Link href="https://simonyi.bme.hu" target="_blank">
        Simonyi
      </Link>
    </Text>
  </Flex>
)

export default Footer
