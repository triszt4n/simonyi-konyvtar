import {
  Text,
  List,
  ListItem,
  Button,
  FormControl,
  Input,
  Flex,
  Stack,
} from "@chakra-ui/core"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import useSWR from "swr"

import { fetcher, useUser } from "lib/hooks"
import { CommentWithUser, OrderWithBooks } from "lib/interfaces"
import TimeAgo from "components/HunTimeAgo"

interface FormData {
  comment: string
}

export default function OrderPage() {
  const [user] = useUser()
  const router = useRouter()
  const orderId = router.query.id

  const { data: order, error } = useSWR<OrderWithBooks>(
    user ? `/api/users/${user.id}/orders/${orderId}` : null,
    fetcher
  )

  const { data: comments, mutate } = useSWR<CommentWithUser[]>(
    orderId ? `/api/orders/${orderId}/comments` : null,
    fetcher
  )

  const { handleSubmit, errors, register, reset } = useForm<FormData>({
    defaultValues: { comment: "" },
  })

  async function addComment(value: FormData) {
    if (!value.comment) return

    const res = await fetch(`/api/orders/${orderId}/comments`, {
      method: "POST",
      body: value.comment,
    })
    if (res.ok) {
      const newComment: CommentWithUser = await res.json()

      mutate((comments) => {
        return [...comments, newComment]
      })
      reset()
    }
  }

  return (
    <>
      {order && (
        <>
          <Text>{order.status}</Text>
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
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <Text>{comment.user.name}</Text>
              <Text>{comment.text}</Text>
              <TimeAgo date={comment.createdAt} />
            </ListItem>
          ))}
        </List>
      )}
      <form onSubmit={handleSubmit(addComment)}>
        <Flex dir="row" mt={4}>
          <FormControl flex="1" mr={4}>
            <Input
              name="comment"
              placeholder="Írd be az üzeneted"
              ref={register}
            />
          </FormControl>
          <Button type="submit">Küldés</Button>
        </Flex>
      </form>
    </>
  )
}
