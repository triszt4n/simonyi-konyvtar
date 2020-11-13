import { Box } from "@chakra-ui/react"
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
        <Box rounded="md" p={4} borderWidth={1} borderColor="lightgrey" mt={4}>
          {data.text} ({data.user.name})
        </Box>
      )}
    </>
  )
}
