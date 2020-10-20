import { Flex, IconButton, List, ListItem, Text } from "@chakra-ui/core"
import { useCart } from "lib/hooks"

export default function CartPage() {
  const { cart, addBook, removeBook, deleteBook } = useCart()
  return (
    <List>
      {cart.books.map((book) => (
        <ListItem key={book.id} as={Flex} flexDir="row" alignItems="center">
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
  )
}
