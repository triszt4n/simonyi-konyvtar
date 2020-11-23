import { Box, Center, List, ListItem, Stack, Tag, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { HiOutlineBookOpen, HiOutlineCalendar, HiArrowNarrowRight } from "react-icons/hi"
import useSWR from "swr"

import { HunDate } from "components/HunDate"
import { Loading } from "components/Loading"
import { STATUSES } from "lib/constants"
import { fetcher, useUser } from "lib/hooks"
import { OrderWithBooks } from "lib/interfaces"

export default function OrdersPage() {
  const [user] = useUser()
  const { data } = useSWR<OrderWithBooks[]>(
    user ? `/api/users/${user.id}/orders/` : null,
    fetcher,
  )

  if (!data) return <Loading />

  return (
    <>
      <List as={Stack} direction="column" spacing={4}>
        {data?.length ? (
          data.map((order) => (
            <NextLink href={`/orders/${order.id}`} key={order.id}>
              <ListItem cursor="pointer">
                <Box
                  rounded="md"
                  p={4}
                  as={Stack}
                  spacing={2}
                  alignItems="start"
                  boxShadow="md"
                  _hover={{
                    transition: "all 200ms ease-in-out",
                    boxShadow: "xl",
                  }}
                >
                  <Tag size="md">{STATUSES[order.status]}</Tag>
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
                </Box>
              </ListItem>
            </NextLink>
          ))
        ) : (
          <Center>
            <Text fontSize="xl">Nincsenek kölcsönzéseid</Text>
          </Center>
        )}
      </List>
    </>
  )
}
