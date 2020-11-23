import { Box, Flex, Stack, Text, Tooltip } from "@chakra-ui/react"
import { format } from "date-fns"
import hu from "date-fns/locale/hu"
import { HiShieldCheck } from "react-icons/hi"

import { timeAgo } from "lib/date"
import { useUser } from "lib/hooks"
import { CommentWithUser } from "lib/interfaces"
import { userrole } from "lib/prismaClient"

interface Props {
  data: CommentWithUser
}

export default function Comment({ data }: Props) {
  const [user] = useUser()
  const isAdminOrEditor =
    data.user.role === userrole.ADMIN || data.user.role === userrole.EDITOR

  return (
    <>
      {user && (
        <Box rounded="md" p={4} boxShadow="md" mt={4}>
          <Flex direction="row" justify="space-between">
            <Stack direction="row" spacing={2} as={Flex} alignItems="center" mb={2}>
              <Text fontSize="sm">{data.user.name}</Text>
              {isAdminOrEditor && <HiShieldCheck />}
            </Stack>
            <Tooltip
              placement="top"
              label={format(new Date(data.createdAt), "yyyy. MMMM dd. HH:mm", {
                locale: hu,
              })}
              aria-label="Küldés ideje"
            >
              <Text fontSize="sm" opacity={0.65}>
                {timeAgo(new Date(data.createdAt))}
              </Text>
            </Tooltip>
          </Flex>
          <Text fontSize="xl">{data.text}</Text>
        </Box>
      )}
    </>
  )
}
