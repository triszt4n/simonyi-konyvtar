import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import dynamic from "next/dynamic"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { HiMinusCircle, HiPlusCircle, HiTrash } from "react-icons/hi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useCart } from "lib/hooks"

function CartPage() {
  const router = useRouter()
  const toast = useToast()
  const { cart, addBook, removeBook, deleteBook, emptyCart } = useCart()
  const [returnDate, setReturnDate] = useState(new Date())

  async function sendOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ returnDate, books: cart.books }),
    })

    if (res.ok) {
      emptyCart()
      router.push("/orders")
    } else {
      const response = await res.json()
      toast({
        title: "Hiba tortent",
        description: response.message,
        status: "error",
      })
    }
  }

  return (
    <>
      <Heading as="h1" mb={4}>
        Kosaram
      </Heading>
      <>
        {cart.sumCount ? (
          <>
            <Button colorScheme="red" onClick={emptyCart}>
              Kosár ürítése
            </Button>
            <List as={Stack} spacing={4} my={4}>
              {cart.books.map((book) => (
                <ListItem key={book.id} boxShadow="md" p="6" rounded="md">
                  <Flex
                    direction={["column", "row"]}
                    alignItems={["start", "center"]}
                    justifyContent="space-between"
                  >
                    <Box mb={[4, 0]}>
                      <NextLink href={`/books/${book.id}`}>
                        <Link>
                          <Text fontSize="2xl">{book.title}</Text>
                        </Link>
                      </NextLink>
                      <Text>{book.author}</Text>
                    </Box>
                    <Stack direction="row" spacing={4} as={Flex} alignItems="center">
                      <IconButton
                        isDisabled={book.quantity === 1}
                        aria-label="darabszám csökkentése"
                        icon={<HiMinusCircle />}
                        onClick={() => removeBook(book)}
                      ></IconButton>
                      <Text>{book.quantity}</Text>
                      <IconButton
                        aria-label="darabszám növelése"
                        icon={<HiPlusCircle />}
                        onClick={() => addBook(book)}
                      ></IconButton>
                      <IconButton
                        aria-label="törlés"
                        colorScheme="red"
                        icon={<HiTrash />}
                        onClick={() => deleteBook(book)}
                      ></IconButton>
                    </Stack>
                  </Flex>
                </ListItem>
              ))}
            </List>
            <DatePicker selected={returnDate} onChange={(d) => setReturnDate(d)} />
            <Button colorScheme="blue" onClick={sendOrder}>
              Foglalás leadása
            </Button>
          </>
        ) : (
          <Center>
            <Text fontSize="lg">A kosarad jelenleg üres</Text>
          </Center>
        )}
      </>
    </>
  )
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false })
