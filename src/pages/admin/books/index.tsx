import { Button, useToast } from "@chakra-ui/react"
import NextLink from "next/link"
import useSWR from "swr"

import { BookList } from "components/books/BookList"
import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"

const BookAdminPage: React.FC = () => {
  const { data, error, mutate } = useSWR<BookWithCategories[]>(
    "/api/books",
    fetcher
  )
  const toast = useToast()

  if (error) return <div>Failed to load books</div>
  if (!data) return <div>Loading...</div>

  async function handleBookDelete(id: number) {
    if (confirm(`Bizosan törlöd a könyvet?`)) {
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" })
      if (response.status === 204) {
        const newBooks = data.filter((it) => it.id !== id)
        mutate(newBooks)
        toast({
          title: "Könyv sikeresen törölve!",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: `Error ${response.status}`,
          description: `${(await response.json()).message}`,
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      <NextLink href={"/admin/books/create"}>
        <Button variant="link">Új könyv felvétele</Button>
      </NextLink>
      {data && <BookList data={data} onDelete={handleBookDelete} />}
    </>
  )
}

export default BookAdminPage
