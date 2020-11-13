import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import Image from "next/image"
import TimeAgo from "components/HunTimeAgo"
import useSWR from "swr"

import { useCart, fetcher } from "lib/hooks"
import { BookWithCategories, CartItem } from "lib/interfaces"

const BookPage = () => {
  const router = useRouter()

  const { data: book, error } = useSWR<BookWithCategories>(
    `/api/books/${router.query.id}`,
    fetcher
  )
  const toast = useToast()
  const { addBook } = useCart()

  if (error) return <div>Failed to load book</div>
  if (!book) return <div>Loading...</div>

  function addToCart(book: CartItem) {
    addBook(book)
    toast({
      title: "A köny a kosárba került",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
      <Flex>
        <Box pr={1}>
          <Image
            src={
              book.image
                ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.image}`
                : "https://placekitten.com/200/300"
            }
            width={200}
            height={300}
          />
        </Box>
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
      <Button
        isDisabled={book.stockCount === 0}
        onClick={() =>
          addToCart({
            id: book.id,
            quantity: 1,
            author: book.author,
            title: book.title,
          })
        }
      >
        Kosárba
      </Button>
    </>
  )
}

export default BookPage
