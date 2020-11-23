import { Tag, chakra, List, ListItem, Text, Stack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import NextLink from "next/link"
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiArrowNarrowRight,
  HiOutlineBookOpen,
} from "react-icons/hi"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import { HunDate } from "components/HunDate"
import { Loading } from "components/Loading"
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

  if (!data) return <Loading />

  return (
    <>
      <List as={Stack} spacing={6}>
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
                  <Stack spacing={4} align="start">
                    <Stack direction="row" spacing={2} align="center">
                      <HiOutlineUser />
                      <Text fontSize="lg">{order.user.name}</Text>
                      <Tag size="md">{STATUSES[order.status]}</Tag>
                    </Stack>
                    <Stack direction="row" spacing={2} align="center">
                      <HiOutlineCalendar />
                      <Stack direction="row" spacing={2} align="center">
                        <HunDate date={new Date(order.createdAt)} />
                        <HiArrowNarrowRight />
                        <HunDate date={new Date(order.returnDate)} />
                      </Stack>
                    </Stack>
                    <List>
                      {order.books.map((book) => (
                        <ListItem key={book.id}>
                          <Stack direction="row" spacing={2} align="center">
                            <HiOutlineBookOpen />
                            <Text>
                              {book.books.title} {book.quantity} db
                            </Text>
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </MotionBox>
              </ListItem>
            </NextLink>
          ))}
      </List>
    </>
  )
}
