import {
  Tag,
  Text,
  List,
  ListItem,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Flex,
  Select,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import HasRole from "components/HasRole"
import Loading from "components/Loading"
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

export default function OrderPage() {
  const router = useRouter()
  const orderId = router.query.id

  const { data: order, mutate: mutateOrder, error } = useSWR<
    OrderWithBooksAndComments & OrderWithBooksAndUser
  >(orderId ? `/api/orders/${orderId}` : null, fetcher)

  const { handleSubmit, errors, register, reset, formState } = useForm<FormData>({
    defaultValues: { comment: "" },
  })

  const toast = useToast()

  if (error) return <ErrorPage statusCode={error.status} message={error.info.message} />
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

      mutateOrder((order) => {
        return { ...order, comments: [...order.comments, newComment] }
      })
      reset()
    }
  }

  async function updateStatus(e: React.FormEvent<HTMLSelectElement>) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status: e.currentTarget.value }),
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
      mutateOrder((order) => ({ ...order, status: newOrder.status }))
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
          <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
            <Select onChange={updateStatus} defaultValue={order.status}>
              {Object.keys(STATUSES).map((key) => (
                <option value={key} key={key}>
                  {STATUSES[key]}
                </option>
              ))}
            </Select>
          </HasRole>
          <Tag size="md">{STATUSES[order.status]}</Tag>
          <Text>{order.user.name}</Text>
          <Text>
            {new Date(order.createdAt).toLocaleDateString()}
            {" - "}
            {new Date(order.returnDate).toLocaleDateString()}
          </Text>
          <List>
            {order?.books.map((book) => (
              <ListItem key={book.id}>
                <Text>{book.books.title}</Text>
                <Text>{book.books.author}</Text>
              </ListItem>
            ))}
          </List>
          <List as={Flex} flexDirection="column">
            {order.comments.map((comment) => (
              <Comment data={comment} key={comment.id} />
            ))}
          </List>
          <Button colorScheme="red" onClick={deleteOrder}>
            Rendelés törlése
          </Button>
        </>
      )}
      <form onSubmit={handleSubmit(addComment)}>
        <Flex dir="row" mt={4}>
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
    </>
  )
}
