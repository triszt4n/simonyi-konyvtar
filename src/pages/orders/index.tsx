import { List, ListItem, Stack, Tag, Text } from "@chakra-ui/react"
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
      <List as={Stack} direction="column" spacing={4}>
        {data &&
          data.map((order) => (
            <NextLink href={`/orders/${order.id}`} key={order.id}>
              <ListItem
                cursor="pointer"
                boxShadow="md"
                p="6"
                rounded="md"
                _hover={{
                  transition: "all 200ms ease-in-out",
                  transform: "translateY(-0.5rem)",
                }}
              >
                <>
                  <Tag size="md">{STATUSES[order.status]}</Tag>
                  <Text>
                    {new Date(order.createdAt).toLocaleDateString()}
                    {" - "}
                    {new Date(order.returnDate).toLocaleDateString()}
                  </Text>
                  <List>
                    {order.books.map((book) => (
                      <ListItem key={book.id}>
                        <Text>
                          {book.books.title} {book.quantity}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </>
              </ListItem>
            </NextLink>
          ))}
      </List>
    </>
  )
}
