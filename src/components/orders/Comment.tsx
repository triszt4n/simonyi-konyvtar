import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { HiShieldCheck } from "react-icons/hi"

import { useUser } from "lib/hooks"
import { CommentWithUser } from "lib/interfaces"

interface Props {
  data: CommentWithUser
}

export default function Comment({ data }: Props) {
  const [user] = useUser()
  return (
    <>
      {user && (
        <Box rounded="md" p={4} boxShadow="md" mt={4}>
          <Stack direction="row" spacing={2} as={Flex} alignItems="center" mb={2}>
            <Text fontSize="sm">{data.user.name}</Text>
            <HiShieldCheck />
          </Stack>
          <Text fontSize="xl">{data.text}</Text>
        </Box>
      )}
    </>
  )
}
