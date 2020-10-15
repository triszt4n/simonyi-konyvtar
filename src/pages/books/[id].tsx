import {
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Tag,
  Text,
} from "@chakra-ui/core"
import { useRouter } from "next/router"
import TimeAgo from "../../components/HunTimeAgo"
import useSWR from "swr"

import { fetcher } from "../../lib/hooks"
import { BookWithCategories } from "../../lib/interfaces"

const BookPage = () => {
  const router = useRouter()

  const { data, error } = useSWR<{ book: BookWithCategories }>(
    `/api/books/${router.query.id}`,
    fetcher
  )

  if (error) return <div>Failed to load book</div>
  if (!data) return <div>Loading...</div>

  const book = data.book

  return (
    <>
      <Flex>
        <Image
          src={book.image || "https://placekitten.com/200/300"}
          maxH="14rem"
          pr="1rem"
        />
        <List spacing={4}>
          <ListItem>
            <Heading as="h1" size="xl">
              {book.title}
            </Heading>
          </ListItem>
          <ListItem>
            <Heading as="h2" size="md">
              {book.author}
            </Heading>
          </ListItem>
          <ListItem>
            <Text>Készleten: {book.stockCount || 0}</Text>
          </ListItem>
          <ListItem>Darabszám: {book.count}</ListItem>
          <ListItem>Kiadás éve: {book.publishedAt}</ListItem>
          <ListItem>Kiadó: {book.publisher}</ListItem>
          <ListItem>Megjegyzés: {book.notes}</ListItem>
          <ListItem>ISBN: {book.isbn}</ListItem>
          <ListItem>
            {book.categories?.map((it) => (
              <Tag key={it.id}>{it.name}</Tag>
            ))}
          </ListItem>
        </List>
      </Flex>
      <Text>
        Legutóbb frissítve:&nbsp;
        <TimeAgo date={book.updatedAt} />
      </Text>
    </>
  )
}

export default BookPage
