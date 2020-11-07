import { List, ListItem, Text } from "@chakra-ui/core"
import { fetcher, useUser } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"
import useSWR from "swr"
import NextLink from "next/link"

export default function OrdersPage(props) {
  const [user] = useUser()
  const { data, error } = useSWR<OrderWithBooks[]>(
    user ? `/api/users/${user.id}/orders/` : null,
    fetcher
  )

  return (
    <>
      <List>
        {data &&
          data.map((order) => (
            <ListItem key={order.id}>
              <>
                <NextLink href={`/orders/${order.id}`}>
                  <Text>{order.status}</Text>
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
