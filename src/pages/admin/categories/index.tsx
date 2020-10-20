import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/core"
import { Category } from "@prisma/client"
import { fetcher } from "lib/hooks"
import React, { FormEvent, useState } from "react"
import useSWR from "swr"

export default function CategoriesIndexPage() {
  const [newCategory, setNewCategory] = useState("")
  const { data, error, mutate } = useSWR<Category[]>("/api/categories", fetcher)

  const toast = useToast()

  if (error) return <div>Failed to load categories</div>
  if (!data) return <div>Loading...</div>

  async function handleDelete(cat: Category) {
    if (
      confirm(
        `A kategória törlésével minden kapcsolódó könyvnél is törlődik.\n
        Biztosan törlöd a(z) "${cat.name}" kategóriát?`
      )
    ) {
      const response = await fetch(`/api/categories/${cat.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        mutate((categories) => {
          return [...categories.filter((it) => it.id !== cat.id)]
        })
      } else {
        const responseMessage = (await response.json()).message
        toast({
          title: "Sikertelen művelet",
          description: responseMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  async function handleAddCategory(event: FormEvent) {
    event.preventDefault()
    const res = await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: newCategory }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      setNewCategory("")

      mutate(async (categories) => {
        const newCategory = await res.json()
        return [newCategory, ...categories.slice(1)]
      })
    }
  }

  async function handleEditCategory({ id, name }) {
    const newName = prompt("Add meg a kategória új nevét!", name)
    if (newName) {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        try {
          const category = await response.json()
          mutate(data.map((it) => (it.id === category.id ? category : it)))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  return (
    <>
      <form onSubmit={handleAddCategory}>
        <InputGroup>
          <Input
            isRequired
            placeholder="Új kategória"
            value={newCategory}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setNewCategory(e.currentTarget.value)
            }
          />
          <InputRightElement width="auto">
            <Button type="submit">Hozzáadás</Button>
          </InputRightElement>
        </InputGroup>
      </form>
      <List>
        {data?.map(({ id, name }) => (
          <ListItem key={id}>
            <Stack spacing={4} isInline as={Flex} alignItems="center">
              <Text>#{id}</Text>
              <Text>{name}</Text>
              <IconButton
                aria-label="szerkesztés"
                icon="edit"
                onClick={() => handleEditCategory({ id, name })}
              />
              <IconButton
                aria-label="törlés"
                icon="delete"
                variantColor="red"
                onClick={() => handleDelete({ id, name })}
              />
            </Stack>
          </ListItem>
        ))}
      </List>
    </>
  )
}
