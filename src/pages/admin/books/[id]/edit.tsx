import { Heading } from "@chakra-ui/core"
import { useRouter } from "next/router"
import useSWR from "swr"

import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"
import { BookForm } from "components/BookForm"

const EditBook = () => {
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
