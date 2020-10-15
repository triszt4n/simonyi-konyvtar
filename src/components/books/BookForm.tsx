import { BookWithCategoryIds } from "../../lib/interfaces"
import { Button } from "@chakra-ui/core"
import useSWR from "swr"
import { Category } from "@prisma/client"
import { fetcher } from "../../lib/hooks"

type BookForm = Omit<BookWithCategoryIds, "id" | "createdAt" | "updatedAt">

const BookForm: React.FC<{
  initialValues: BookForm
  onSubmit: (event: React.MouseEvent<any, MouseEvent>) => void
}> = ({ initialValues, onSubmit }) => {
  const { data, error } = useSWR<{ categories: Category[] }>(
    "/api/categories",
    fetcher
  )

  initialValues = initialValues || {
    author: "",
    notes: "",
    count: 0,
    image: "",
    isbn: "",
    publishedAt: null,
    publisher: "",
    stockCount: 0,
    title: "",
    categories: [],
  }

  return (
    <>
      {/* TODO: add book form inputs here */}
      <Button onClick={onSubmit}>Save</Button>
      <p>Hello form</p>
    </>
  )
}

export default BookForm
