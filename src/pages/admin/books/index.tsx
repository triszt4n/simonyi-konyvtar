import { Button, Flex, List, ListItem, Text, useToast } from '@chakra-ui/core'
import { Book } from '@prisma/client'
import useSWR from 'swr'

import { fetcher } from '../../../lib/hooks'

const BookList: React.FC = () => {
  const { data, error, mutate } = useSWR<{ books: Book[] }>(
    '/api/books',
    fetcher
  )

  if (error) return <div>Failed to load books</div>
  if (!data) return <div>Loading...</div>

  const toast = useToast()

  async function deleteBook(id: number) {
    if (confirm(`Bizosan törlöd a könyvet?`)) {
      const response = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (response.status === 204) {
        const newBooks = data.books.filter((it) => it.id !== id)
        mutate({ books: newBooks })
        toast({
          title: 'Könyv sikeresen törölve!',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: `Error ${response.status}`,
          description: `${(await response.json()).message}`,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <List>
      {data.books.map((book) => (
        <ListItem key={book.id}>
          <Flex
            direction='row'
            wrap='wrap'
            alignItems='center'
            justify='space-between'
          >
            <Text>{book.title}</Text>
            <Button>Szerkesztes</Button>
            <Button onClick={() => deleteBook(book.id)}>Torles</Button>
          </Flex>
        </ListItem>
      ))}
    </List>
  )
}

export default BookList
