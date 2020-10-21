import { SimpleGrid, Input } from "@chakra-ui/core"
import useSWR from "swr"

import { BookPreview } from "components/books/BookPreview"
import { Main } from "components/Main"
import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"

const Index = () => {
  const { data, error } = useSWR<BookWithCategories[]>("/api/books", fetcher)

  if (error) return <div>Failed to load books</div>
  if (!data) return <div>Loading...</div>

  return (
    <Main>
      <Input placeholder="Keress a könyvek között!" mt="1rem" />
      <SimpleGrid minChildWidth="min(100%, 24rem)" spacing="2rem">
        {data.map((book) => (
          <BookPreview key={book.id} book={book} />
        ))}
      </SimpleGrid>
    </Main>
  )
}

export default Index
