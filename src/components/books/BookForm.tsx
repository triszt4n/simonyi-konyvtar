import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Tag,
  TagLabel,
  Textarea,
  useToast,
} from "@chakra-ui/core"
import { Category } from "@prisma/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useSWR from "swr"

import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"
import { useRouter } from "next/router"

type FormData = {
  title: string
  author: string
  isbn: string
  publisher: string
  publishedAt: string
  count: string
  stockCount: string
  notes: string
}

interface Props {
  initialValue?: BookWithCategories
}

export function BookForm({ initialValue }: Props) {
  const { id, createdAt, updatedAt, categories: cats, ...book } =
    initialValue || {}

  const { data: categories } = useSWR<Category[]>("/api/categories", fetcher)

  const [formCategories, setFormCategories] = useState([])

  const { handleSubmit, errors, register, formState } = useForm<
    BookWithCategories
  >({
    defaultValues: {
      ...book,
    },
  })

  useEffect(() => {
    setFormCategories(
      categories?.map((it) => ({
        ...it,
        checked: initialValue
          ? initialValue.categories.some((c) => c.id === it.id)
          : false,
      }))
    )
  }, [categories, initialValue])

  const router = useRouter()
  const toast = useToast()

  function updateFormCategories(id: number) {
    setFormCategories((c) =>
      c.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    )
  }

  async function onSubmit(values: FormData) {
    const formData = {
      ...values,
      categories: formCategories
        .filter((it) => it.checked)
        .map((it) => ({ id: it.id })),
    }

    if (initialValue) {
      const res = await fetch(`/api/books/${initialValue.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          count: parseInt(formData.count),
          stockCount: parseInt(formData.stockCount),
          publishedAt: parseInt(formData.publishedAt),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        toast({
          title: "Köny sikeresen frissítve",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        router.push("/admin")
      } else {
        const response = await res.json()
        toast({
          title: "Hiba történt",
          status: "error",
          description: response.message,
          duration: 3000,
          isClosable: true,
        })
      }
    } else {
      const res = await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          count: parseInt(formData.count),
          stockCount: parseInt(formData.stockCount),
          publishedAt: parseInt(formData.publishedAt),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res.ok) {
        toast({
          title: "Köny sikeresen hozzáadva",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        const response = await res.json()
        toast({
          title: "Hiba történt",
          status: "error",
          description: response.message,
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} shouldWrapChildren={true}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Cím</FormLabel>
          <Input
            name="title"
            placeholder="Cím"
            ref={register({ required: true })}
          />
          <FormErrorMessage>
            {errors.title && "A cím kitöltése kötelező"}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.author}>
          <FormLabel htmlFor="author">Szerző</FormLabel>
          <Input name="author" placeholder="Szerző" ref={register} />
          <FormErrorMessage>
            {errors.author && errors.author.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.isbn}>
          <FormLabel htmlFor="isbn">ISBN</FormLabel>
          <Input name="isbn" placeholder="ISBN" ref={register} />
          <FormErrorMessage>
            {errors.isbn && errors.isbn.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.count}>
          <FormLabel htmlFor="count">Darabszám</FormLabel>
          <Input
            type="number"
            defaultValue={1}
            name="count"
            ref={register}
            min={1}
          />
          <FormErrorMessage>
            {errors.count && errors.count.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.isbn}>
          <FormLabel htmlFor="publisher">Kiadó</FormLabel>
          <Input name="publisher" placeholder="Kiadó" ref={register} />
          <FormErrorMessage>
            {errors.publisher && errors.publisher.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.publishedAt}>
          <FormLabel htmlFor="publishedAt">Kiadás éve</FormLabel>
          <Input type="number" name="publishedAt" ref={register} />
          <FormErrorMessage>
            {errors.publishedAt && errors.publishedAt.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.stockCount}>
          <FormLabel htmlFor="stockCount">Készleten</FormLabel>
          <Input
            defaultValue={1}
            min={0}
            type="number"
            name="stockCount"
            ref={register}
          />
          <FormErrorMessage>
            {errors.stockCount && errors.stockCount.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.notes}>
          <FormLabel htmlFor="notes">Megjegyzés</FormLabel>
          <Textarea name="notes" placeholder="Megjegyzés" ref={register} />
          <FormErrorMessage>
            {errors.notes && errors.notes.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Kategóriák</FormLabel>
          <Stack
            spacing={4}
            isInline
            as={Flex}
            alignItems="center"
            flexWrap="wrap"
          >
            {formCategories?.map((category) => (
              <Tag
                key={category.id}
                variantColor={category.checked ? "green" : "gray"}
                cursor="pointer"
                mb={2}
                onClick={() => updateFormCategories(category.id)}
              >
                <TagLabel>{category.name}</TagLabel>
              </Tag>
            ))}
          </Stack>
        </FormControl>

        <Button isLoading={formState.isSubmitting} type="submit">
          Mentés
        </Button>
      </Stack>
    </form>
  )
}
