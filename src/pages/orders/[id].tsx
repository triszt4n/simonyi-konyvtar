import {
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

import Comment from "components/orders/Comment"
import HasRole from "components/HasRole"
import Loading from "components/Loading"
import { STATUSES } from "lib/constants"
import { fetcher, useUser } from "lib/hooks"
import { CommentWithUser, OrderWithBooks } from "lib/interfaces"
import { userrole } from "lib/prismaClient"

interface FormData {
  comment: string
}

export default function OrderPage() {
  const [user] = useUser()
  const {
    query: { id: orderId },
  } = useRouter()

  const { data: order, mutate: mutateOrder } = useSWR<OrderWithBooks>(
    user ? `/api/users/${user.id}/orders/${orderId}` : null,
    fetcher,
  )

  const { data: comments, mutate: mutateComments } = useSWR<CommentWithUser[]>(
    orderId ? `/api/orders/${orderId}/comments` : null,
    fetcher,
  )

  const { handleSubmit, errors, register, reset, formState } = useForm<FormData>({
    defaultValues: { comment: "" },
  })

  const toast = useToast()

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

      mutateComments((comments) => {
        return [...comments, newComment]
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
        title: "Hiba tortent!",
        description: "Nem sikerult frissiteni az allapotot",
        status: "error",
        isClosable: true,
        duration: 3000,
      })
    } else {
      const newOrder = await res.json()
      mutateOrder(newOrder)
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
          <Text>{STATUSES[order.status]}</Text>
          <List>
            {order?.books.map((book) => (
              <ListItem key={book.id}>
                <Text>{book.books.title}</Text>
                <Text>{book.books.author}</Text>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {comments && (
        <List as={Flex} flexDirection="column">
          {comments.map((comment) => (
            <Comment data={comment} key={comment.id} />
          ))}
        </List>
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
