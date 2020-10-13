import { Image, Flex, Text } from '@chakra-ui/core'

interface ErrorPageProps {
  statusCode: number
  message?: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, message }) => {
  return (
    <Flex direction='column'>
      <Text>{message}</Text>
      <Image
        src={`https://http.cat/${statusCode}`}
        alt={`Error ${statusCode}`}
        htmlWidth='100%'
      />
    </Flex>
  )
}

export default ErrorPage
