import { SimpleGrid, Input } from "@chakra-ui/react"
import { Book } from "@prisma/client"
import { useState } from "react"
import useSWR from "swr"
import { useDebouncedCallback } from "use-debounce"

import { BookPreview } from "components/books/BookPreview"
import Loading from "components/Loading"
import { Main } from "components/Main"
import { fetcher } from "lib/hooks"

const Index = () => {
  const [term, setTerm] = useState("")
  const { data, error } = useSWR<Book[]>(`/api/books?q=${term}`, fetcher)
  const debounced = useDebouncedCallback((value) => setTerm(value), 500)

  if (error) return <div>Nem sikerült betölteni a könyveket</div>

  return (
    <Main>
      <Input
        placeholder="Keress a könyvek között!"
        mt="1rem"
        onChange={(e) => debounced.callback(e.target.value)}
      />
      {data ? (
        <>
          {data.length ? (
            <SimpleGrid minChildWidth="min(100%, 24rem)" spacing="2rem">
              {data.map((book) => (
                <BookPreview key={book.id} book={book} />
              ))}
            </SimpleGrid>
          ) : (
            <p>Nincs a keresésnek megfelelő találat</p>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Main>
  )
}

export default Index
