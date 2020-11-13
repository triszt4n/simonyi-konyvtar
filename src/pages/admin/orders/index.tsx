import { List, ListItem, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import useSWR from "swr"

import { fetcher } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"

export default function OrdersPage() {
  const { data, error } = useSWR<OrderWithBooks[]>(`/api/orders/`, fetcher)

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
