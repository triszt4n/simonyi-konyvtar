import { Flex, Text } from "@chakra-ui/react"
import Image from "next/image"

interface ErrorPageProps {
  statusCode: number
  message?: string
}

function ErrorPage({ statusCode, message }: ErrorPageProps) {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Text fontSize="xl">{message}</Text>
      <Image
        src={`https://http.cat/${statusCode}`}
        width={640}
        height={512}
        alt={`${statusCode} Error`}
      />
    </Flex>
  )
}

export default ErrorPage
