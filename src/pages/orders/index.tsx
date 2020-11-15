import { List, ListItem, Text } from "@chakra-ui/react"
import useSWR from "swr"
import NextLink from "next/link"
import { STATUSES } from "lib/constants"
import { fetcher, useUser } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"

export default function OrdersPage() {
  const [user] = useUser()
  const { data } = useSWR<OrderWithBooks[]>(
    user ? `/api/users/${user.id}/orders/` : null,
    fetcher,
  )

  return (
    <>
      <List>
        {data &&
          data.map((order) => (
            <ListItem key={order.id}>
              <>
                <NextLink href={`/orders/${order.id}`}>
                  <Text>{STATUSES[order.status]}</Text>
                </NextLink>
                <List>
                  {order.books.map((book) => (
                    <ListItem key={book.id}>
                      <Text>{book.books.title}</Text>
                      <Text>{book.quantity}</Text>
                    </ListItem>
                  ))}
                </List>
              </>
            </ListItem>
          ))}
      </List>
    </>
  )
}
