import { Flex, List, ListItem, Text } from "@chakra-ui/core"
import { User } from "@prisma/client"
import NextLink from "next/link"
import { fetcher } from "lib/hooks"
import useSWR from "swr"

export default function UserList() {
  const { data, error } = useSWR<User[]>("/api/users", fetcher)

  if (error) return <div>Failed to load users</div>
  if (!data) return <div>Loading...</div>

  return (
    <List>
      {data.map((user) => (
        <ListItem key={user.id}>
          <Flex flexDir="row" alignItems="center">
            <Text>#{user.id}</Text>
            <NextLink href={`/admin/users/${user.id}`}>{user.name}</NextLink>
            <Text>{user.role}</Text>
          </Flex>
        </ListItem>
      ))}
    </List>
  )
}
