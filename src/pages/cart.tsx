import {
  Button,
  Flex,
  IconButton,
  List,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/core"
import { useCart } from "lib/hooks"
import { useRouter } from "next/router"

export default function CartPage() {
  const router = useRouter()
  const toast = useToast()
  const { cart, addBook, removeBook, deleteBook, emptyCart } = useCart()

  async function sendOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(cart.books),
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
      {cart.books.length ? (
        <>
          <Button variantColor="red" onClick={emptyCart}>
            Kosár ürítése
          </Button>
          <List>
            {cart.books.map((book) => (
              <ListItem
                key={book.id}
                as={Flex}
                flexDir="row"
                alignItems="center"
              >
                <Text>{book.title}</Text>&nbsp;
                <Text>Darabszam:&nbsp;{book.quantity}</Text>
                <IconButton
                  aria-label="darabszám csökkentése"
                  icon="minus"
                  onClick={() => removeBook(book)}
                ></IconButton>
                <IconButton
                  aria-label="hozzáadás"
                  icon="add"
                  onClick={() => addBook(book)}
                ></IconButton>
                <IconButton
                  aria-label="törlés"
                  icon="delete"
                  onClick={() => deleteBook(book)}
                ></IconButton>
              </ListItem>
            ))}
          </List>
          <Button onClick={sendOrder}>Foglalás leadása</Button>
        </>
      ) : (
        <Text>A kosarad jelenleg üres</Text>
      )}
    </>
  )
}
