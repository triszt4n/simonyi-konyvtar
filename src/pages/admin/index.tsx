import { List, ListItem } from "@chakra-ui/react"
import NextLink from "next/link"

import ErrorPage from "components/ErrorPage"
import { useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function AdminIndex() {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return (
      <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
    )
  }

  return (
    <List>
      <ListItem>
        <NextLink href="/admin/books">Konyvek</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/categories">Kategoriak</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/orders">Kolcsonzesek</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/users">Felhasznalok</NextLink>
      </ListItem>
    </List>
  )
}
