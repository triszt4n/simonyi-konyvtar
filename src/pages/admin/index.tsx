import { List, ListItem, Link } from "@chakra-ui/react"
import NextLink from "next/link"

import ErrorPage from "components/ErrorPage"
import HasRole from "components/HasRole"
import { useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function AdminIndex() {
  const hasAccess = useRequireRoles([userrole.ADMIN, userrole.EDITOR])
  if (!hasAccess) {
    return <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
  }

  return (
    <List>
      <HasRole roles={[userrole.ADMIN]}>
        <>
          <ListItem>
            <NextLink href="/admin/books">
              <Link>Könyvek</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/admin/categories">
              <Link>Kategóriák</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/admin/users">
              <Link>Felhasználók</Link>
            </NextLink>
          </ListItem>
        </>
      </HasRole>
      <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
        <ListItem>
          <NextLink href="/admin/orders">
            <Link>Kölcsönzések</Link>
          </NextLink>
        </ListItem>
      </HasRole>
    </List>
  )
}
