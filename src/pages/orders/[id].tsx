import {
  Stack,
  Tag,
  Text,
  List,
  ListItem,
  Link,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Flex,
  useToast,
  Heading,
} from "@chakra-ui/react"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { HiOutlineUser, HiOutlineCalendar, HiArrowNarrowRight } from "react-icons/hi"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import HasRole from "components/HasRole"
import { HunDate } from "components/HunDate"
import { Loading } from "components/Loading"
import Comment from "components/orders/Comment"
import { STATUSES } from "lib/constants"
import { fetcher } from "lib/hooks"
import {
  CommentWithUser,
  OrderWithBooksAndComments,
  OrderWithBooksAndUser,
} from "lib/interfaces"
import { userrole } from "lib/prismaClient"

interface FormData {
  comment: string
}

const StatusButtonsMap = {
  PENDING: "Függőben",
  RENTED: "Kiadva",
  RETURNED: "Visszahozva",
}

export default function OrderPage() {
  const router = useRouter()
  const orderId = router.query.id

  const { data: order, mutate, error } = useSWR<
    OrderWithBooksAndComments & OrderWithBooksAndUser
  >(orderId ? `/api/orders/${orderId}` : null, fetcher)

  const { handleSubmit, errors, register, reset, formState } = useForm<FormData>({
    defaultValues: { comment: "" },
  })

  const toast = useToast()

  if (error) return <ErrorPage statusCode={error.status} message={error.info?.message} />
  if (!order) return <Loading />

  async function addComment(value: FormData) {
    if (!value.comment) return

    const res = await fetch(`/api/orders/${orderId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: value.comment }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      const newComment: CommentWithUser = await res.json()

      mutate((order) => {
        return { ...order, comments: [...order.comments, newComment] }
      })
      reset()
    }
  }

  async function updateStatus(e: string) {
    if (confirm(`Biztosan ${e} státuszra állítod a kölcsönzést?`)) {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status: e }),
      })
      if (!res.ok) {
        toast({
          title: "Hiba történt",
          description: "Nem sikerült frissíteni az állapotot",
          status: "error",
          isClosable: true,
          duration: 3000,
        })
      } else {
        const newOrder = await res.json()
        mutate((order) => ({ ...order, status: newOrder.status }))
      }
    }
  }

  async function deleteOrder() {
    if (confirm("Biztosan törlöd a foglalást?")) {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      if (res.ok) {
        router.replace("/orders")
      } else {
        toast({
          title: "Hiba történt",
          description: "Nem sikerült a foglalás törlése",
          status: "error",
          isClosable: true,
          duration: 3000,
        })
      }
    }
  }

  return (
    <>
      {order && (
        <>
          <Stack direction="column" spacing={4} align="start">
            <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
              <>
                <Heading as="h2" fontSize="lg">
                  Kölcsönzés kezelése
                </Heading>
                <Stack direction="row" spacing={4}>
                  {Object.keys(StatusButtonsMap).map((key) => (
                    <Button onClick={() => updateStatus(key)} key={key}>
                      {STATUSES[key]}
                    </Button>
                  ))}
                </Stack>
              </>
            </HasRole>
            <Heading as="h2" fontSize="lg">
              Kölcsönzés részletei
            </Heading>
            <Tag size="md">{STATUSES[order.status]}</Tag>
            <Stack direction="row" spacing={2} align="center">
              <HiOutlineUser />
              <Text>{order.user.name}</Text>
            </Stack>
            <Stack direction="row" spacing={2} align="center">
              <HiOutlineCalendar />
              <Stack direction="row" spacing={2} align="center">
                <HunDate date={new Date(order.createdAt)} />
                <HiArrowNarrowRight />
                <HunDate date={new Date(order.returnDate)} />
              </Stack>
            </Stack>
            <List alignSelf="stretch" as={Stack} spacing={4}>
              {order?.books.map((book) => (
                <ListItem key={book.id} boxShadow="md" p="6" rounded="md">
                  <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Flex direction="row" alignItems="center">
                      <NextImage
                        src={
                          book.books.image
                            ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.books.image}`
                            : "https://placekitten.org/30/40"
                        }
                        height={60}
                        width={40}
                      />
                      <Flex direction="column" ml={2}>
                        <NextLink href={`/books/${book.books.id}`}>
                          <Link>
                            <Text fontSize="xl">{book.books.title}</Text>
                          </Link>
                        </NextLink>
                        <Text fontSize="sm">{book.books.author}</Text>
                      </Flex>
                    </Flex>
                    <Text>{book.quantity} db</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
            <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
              <Button colorScheme="red" onClick={deleteOrder}>
                Foglalás törlése
              </Button>
            </HasRole>
          </Stack>
          <Flex direction="column" justifyContent="space-between">
            <List as={Flex} flexDirection="column">
              {order.comments.map((comment) => (
                <Comment data={comment} key={comment.id} />
              ))}
            </List>
            <form onSubmit={handleSubmit(addComment)}>
              <Flex direction="row" mt={4}>
                <FormControl flex="1" mr={4}>
                  <Input name="comment" placeholder="Írd be az üzeneted" ref={register} />
                  <FormErrorMessage>
                    {errors.comment && errors.comment.message}
                  </FormErrorMessage>
                </FormControl>
                <Button isLoading={formState.isSubmitting} type="submit">
                  Küldés
                </Button>
              </Flex>
            </form>
          </Flex>
        </>
      )}
    </>
  )
}
