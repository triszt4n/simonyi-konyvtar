import { List, ListItem, Text } from "@chakra-ui/core"
import { fetcher } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"
import useSWR from "swr"

export default function OrdersPage(props) {
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
                  <ListItem key={book.id}>
                    <Text>{book.books.title}</Text>
                    <Text>{book.quantity}</Text>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
      </List>
    </>
  )
}
