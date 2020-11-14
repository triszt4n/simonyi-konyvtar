import { List, ListItem, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import { userrole } from "lib/prismaClient"
import { fetcher, useRequireRoles } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"

export default function OrdersPage() {
  const { data, error } = useSWR<OrderWithBooks[]>(`/api/orders/`, fetcher)
  const hasAccess = useRequireRoles([userrole.ADMIN, userrole.EDITOR])
  if (!hasAccess) {
    return (
      <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
    )
  }

  return (
    <>
      <List>
        {data &&
          data.map((order) => (
            <ListItem key={order.id}>
              <Text>{order.status}</Text>
              <List>
                {order.books.map((book) => (
                  <NextLink href={`/orders/${order.id}`} key={book.id}>
                    <ListItem key={book.id}>
                      <Text>{book.books.title}</Text>
                      <Text>{book.quantity}</Text>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </ListItem>
          ))}
      </List>
    </>
  )
}
