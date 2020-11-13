import { Flex, Text } from "@chakra-ui/react"
import Image from "next/image"

interface ErrorPageProps {
  statusCode: number
  message?: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, message }) => {
  return (
    <Flex direction="column">
      <Text>{message}</Text>
      <Image
        src={`https://http.cat/${statusCode}`}
        width={500}
        height={500}
        alt={`${statusCode} Error`}
      />
    </Flex>
  )
}

export default ErrorPage
