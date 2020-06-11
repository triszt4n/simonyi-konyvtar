import { Button } from '@chakra-ui/core'
import { useCallback } from 'react'

export default function CreateBook() {
  const createBook = useCallback(async () => {
    await fetch('/api/books', { method: 'POST' })
  }, [])

  return <Button onClick={createBook}>Add book</Button>
}
