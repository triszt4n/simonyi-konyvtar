import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tag,
  TagLabel,
  Textarea,
  useToast,
} from "@chakra-ui/core"
import { Category } from "@prisma/client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useSWR from "swr"
import { fetcher } from "lib/hooks"

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

const CreateBook = () => {
  const { data: categories, error } = useSWR<Category[]>(
    "/api/categories",
    fetcher
  )
  const toast = useToast()

  const [formCategories, setFormCategories] = useState([])

  useEffect(() => {
    setFormCategories(categories?.map((it) => ({ ...it, checked: false })))
  }, [categories])

  const { handleSubmit, errors, register, formState } = useForm<FormData>()

  async function onSubmit(values: FormData) {
    const formData = {
      ...values,
      categories: formCategories
        .filter((it) => it.checked)
        .map((it) => ({ id: it.id })),
    }

    const result = await fetch("/api/books", {
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

    if (!result.ok) {
      const response = await result.json()
      toast({
        title: "Hiba történt",
        status: "error",
        description: response.message,
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Könyv sikeresen hozzáadva",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  function updateFormCategories(id: number) {
    setFormCategories((c) =>
      c.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    )
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
          <NumberInput defaultValue={1} min={1}>
            <NumberInputField
              name="count"
              ref={register({ required: true, min: 1 })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
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
          <NumberInput>
            <NumberInputField name="publishedAt" ref={register} />
          </NumberInput>
          <FormErrorMessage>
            {errors.publishedAt && errors.publishedAt.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.stockCount}>
          <FormLabel htmlFor="stockCount">Készleten</FormLabel>
          <NumberInput defaultValue={1} min={0}>
            <NumberInputField
              name="stockCount"
              ref={register({ required: true, min: 0 })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
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
          <Stack spacing={4} isInline>
            {formCategories?.map((category) => (
              <Tag
                key={category.id}
                variantColor={category.checked ? "green" : "gray"}
                cursor="pointer"
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

export default CreateBook
