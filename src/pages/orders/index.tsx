import { List, ListItem, Stack, Tag, Text, chakra } from "@chakra-ui/react"
import { motion } from "framer-motion"
import useSWR from "swr"
import NextLink from "next/link"

import { STATUSES } from "lib/constants"
import { fetcher, useUser } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"

const MotionBox = chakra(motion.div)

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
              <ListItem cursor="pointer">
                <MotionBox
                  rounded="md"
                  p={4}
                  whileHover={{
                    boxShadow: "0px 0px 8px lightgray",
                  }}
                >
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
                </MotionBox>
              </ListItem>
            </NextLink>
          ))}
      </List>
    </>
  )
}
