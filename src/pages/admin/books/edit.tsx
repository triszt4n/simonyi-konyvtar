import { useToast } from "@chakra-ui/core"
import { useRouter } from "next/router"
import useSWR from "swr"

import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"

const EditBook = () => {
  const router = useRouter()
  const toast = useToast()

  const { data, error } = useSWR<{ book: BookWithCategories }>(
    `/api/books/${router.query.id}`,
    fetcher
  )

  const updateBook = async () => {
    const response = await fetch("/api/books", { method: "PUT" })

    if (response.status === 201) {
      toast({
        title: "Konyv sikeresen letrehozva",
      })
    }
  }

  const initialValues = data?.book

  return <>{/* TODO */}</>
}

export default EditBook
