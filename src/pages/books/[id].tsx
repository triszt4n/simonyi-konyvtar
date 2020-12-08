import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Tag,
  Text,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import NextImage from "next/image"
import useSWR from "swr"

import { Loading } from "components/Loading"
import { timeAgo } from "lib/date"
import { useCart, fetcher } from "lib/hooks"
import { BookWithCategoriesAndOrders, CartItem } from "lib/interfaces"

const BookPage = () => {
  const {
    query: { id },
  } = useRouter()

  const { data: book, error } = useSWR<BookWithCategoriesAndOrders>(
    id ? `/api/books/${id}` : null,
    fetcher,
  )
  const toast = useToast()
  const { addBook } = useCart()

  if (error) return <div>Nem sikerült betölteni a könyvet</div>
  if (!book) return <Loading />

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
      <Flex direction={["column", null, "row"]}>
        <Box mr={4}>
          <NextImage
            src={
              book.image
                ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.image}`
                : "https://via.placeholer.com/200x300"
            }
            width={300}
            height={450}
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
          <Wrap>
            {book.categories?.map((it) => (
              <WrapItem key={it.id}>
                <Tag>{it.name}</Tag>
              </WrapItem>
            ))}
          </Wrap>
          <ListItem>
            <Text>
              Legutóbb frissítve:&nbsp;
              {timeAgo(new Date(book.updatedAt))}
            </Text>
          </ListItem>
        </List>
      </Flex>
      <Button
        mt={4}
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
