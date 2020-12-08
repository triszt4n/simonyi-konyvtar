import { List, ListItem, Link, Stack, Flex } from "@chakra-ui/react"
import NextLink from "next/link"
import { HiBookOpen, HiTag, HiUser, HiShare } from "react-icons/hi"

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
    <List as={Stack} spacing={4} direction="column" mt={4}>
      <HasRole roles={[userrole.ADMIN]}>
        <>
          <ListItem>
            <NextLink href="/admin/books">
              <Flex direction="row" alignItems="center">
                <HiBookOpen />
                <Link ml={2} fontSize="xl">
                  Könyvek
                </Link>
              </Flex>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/admin/categories">
              <Flex direction="row" alignItems="center">
                <HiTag />
                <Link ml={2} fontSize="xl">
                  Kategóriák
                </Link>
              </Flex>
            </NextLink>
          </ListItem>
          {/* <ListItem>
            <NextLink href="/admin/users">
              <Flex direction="row" alignItems="center">
                <HiBookOpen />
                <Link ml={2} fontSize="xl">
                  Felhasználók
                </Link>
              </Flex>
            </NextLink>
          </ListItem> */}
        </>
      </HasRole>
      <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
        <ListItem>
          <NextLink href="/admin/orders">
            <Flex direction="row" alignItems="center">
              <HiShare />
              <Link ml={2} fontSize="xl">
                Kölcsönzések
              </Link>
            </Flex>
          </NextLink>
        </ListItem>
      </HasRole>
    </List>
  )
}
