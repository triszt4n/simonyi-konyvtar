import { Flex, List, ListItem, Text } from "@chakra-ui/react"
import { User } from "@prisma/client"
import NextLink from "next/link"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import { Loading } from "components/Loading"
import { fetcher, useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function UserList() {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
  }

  const { data, error } = useSWR<User[]>("/api/users", fetcher)

  if (error) return <Text fontSize="lg">Nem sikerült betölteni a felhasználókat</Text>
  if (!data) return <Loading />

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
