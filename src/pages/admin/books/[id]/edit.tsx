import { Heading } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useSWR from "swr"

import { BookForm } from "components/books/BookForm"
import ErrorPage from "components/ErrorPage"
import { userrole } from "lib/prismaClient"
import { fetcher, useRequireRoles } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"

const EditBook = () => {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return (
      <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
    )
  }
  const router = useRouter()

  const { data } = useSWR<BookWithCategories>(
    `/api/books/${router.query.id}`,
    fetcher
  )

  return (
    <>
      <Heading as="h2">Könyv szerkesztése</Heading>
      {data && <BookForm initialValue={data} />}
    </>
  )
}

export default EditBook
