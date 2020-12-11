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
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { addDays, addMonths } from "date-fns"
import hu from "date-fns/locale/hu"
import dynamic from "next/dynamic"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState, forwardRef } from "react"
import { HiMinusCircle, HiPlusCircle, HiTrash } from "react-icons/hi"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useCart, useUser } from "lib/hooks"

registerLocale("hu", hu)

interface DatePickerInputProps {
  value?: string
  onClick?: () => void
}

function CartPage() {
  const router = useRouter()
  const toast = useToast()
  const { cart, addBook, removeBook, deleteBook, emptyCart } = useCart()
  const [user] = useUser()
  const [returnDate, setReturnDate] = useState(new Date())

  const CustomDatePickerInput = forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ value, onClick }: DatePickerInputProps, ref) => (
      <Button variant="outline" onClick={onClick}>
        {value}
      </Button>
    ),
  )
  CustomDatePickerInput.displayName = "CustomDatePickerInput"

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
        title: "Hiba történt",
        description: response.message,
        status: "error",
      })
    }
  }

  return (
    <>
      <Stack spacing={4} direction="row">
        <Heading as="h1" mb={4}>
          Kosaram
        </Heading>
        {cart.sumCount && (
          <Tooltip label="Kosár ürítése" aria-label="Kosár ürítése">
            <IconButton
              colorScheme="red"
              onClick={emptyCart}
              aria-label="kosár ürítése"
              icon={<HiTrash />}
            />
          </Tooltip>
        )}
      </Stack>
      <>
        {cart.sumCount ? (
          <>
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
            {user ? (
              <Stack direction="column" spacing={4} align="start">
                <Heading as="h2" fontSize="xl">
                  Kölcsönzés lejárati ideje
                </Heading>
                <DatePicker
                  locale="hu"
                  dateFormat="yyyy-MM-dd"
                  minDate={addDays(new Date(), 1)}
                  maxDate={addMonths(new Date(), 3)}
                  selected={returnDate}
                  onChange={(d: Date) => setReturnDate(d)}
                  customInput={<CustomDatePickerInput />}
                />
                <Button colorScheme="blue" onClick={sendOrder}>
                  Foglalás leadása
                </Button>
              </Stack>
            ) : (
              <Text fontSize="lg">A foglalás leadásához jelentezz be!</Text>
            )}
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
