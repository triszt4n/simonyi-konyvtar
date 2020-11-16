import { Tag, chakra, List, ListItem, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
import NextLink from "next/link"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import { STATUSES } from "lib/constants"
import { fetcher, useRequireRoles } from "lib/hooks"
import { OrderWithBooksAndUser } from "lib/interfaces"
import { userrole } from "lib/prismaClient"

const MotionBox = chakra(motion.div)

export default function OrdersPage() {
  const { data } = useSWR<OrderWithBooksAndUser[]>("/api/orders/", fetcher)
  const hasAccess = useRequireRoles([userrole.ADMIN, userrole.EDITOR])
  if (!hasAccess) {
    return <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
  }

  return (
    <>
      <List>
        {data &&
          data.map((order) => (
            <NextLink key={order.id} href={`/orders/${order.id}`}>
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
                    <Text>{order.user.name}</Text>
                    {order.books.map((book) => (
                      <ListItem key={book.id}>
                        <Text>{book.books.title}</Text>
                        <Text>{book.quantity}</Text>
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
