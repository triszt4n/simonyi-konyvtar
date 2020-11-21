import { Button, Text, useToast } from "@chakra-ui/react"
import NextLink from "next/link"
import useSWR from "swr"

import { BookList } from "components/books/BookList"
import ErrorPage from "components/ErrorPage"
import Loading from "components/Loading"
import { fetcher, useRequireRoles } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"
import { userrole } from "lib/prismaClient"

const BookAdminPage: React.FC = () => {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
  }
  const { data, error, mutate } = useSWR<BookWithCategories[]>("/api/books", fetcher)
  const toast = useToast()

  if (error) return <Text fontSize="lg">Nem sikerült betölteni a könyveket</Text>
  if (!data) return <Loading />

  async function handleBookDelete(id: number) {
    if (confirm("Bizosan törlöd a könyvet?")) {
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
