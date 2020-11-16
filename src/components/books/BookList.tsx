import { List, ListItem, IconButton, Text, Flex, Link, Tooltip } from "@chakra-ui/react"
import { HiPencilAlt, HiTrash } from "react-icons/hi"

import { BookWithCategories } from "lib/interfaces"
import NextLink from "next/link"

interface Props {
  data: BookWithCategories[]
  onDelete: (id: number) => void
}

export function BookList({ data, onDelete }: Props) {
  return (
    <List>
      {data.map((book) => (
        <ListItem key={book.id}>
          <Flex alignItems="center" flexDir="row">
            <Text>#{book.id}</Text>
            <NextLink href={`/books/${book.id}`}>
              <Link>{book.title}</Link>
            </NextLink>
            <NextLink href={`/admin/books/${book.id}/edit`}>
              <Link>
                <Tooltip label="Szerkesztés" aria-label="Szerkesztés" placement="top">
                  <IconButton aria-label="szerkesztés" icon={<HiPencilAlt />} />
                </Tooltip>
              </Link>
            </NextLink>
            <Tooltip label="Törlés" aria-label="Törlés" placement="top">
              <IconButton
                aria-label="törlés"
                icon={<HiTrash />}
                colorScheme="red"
                cursor="pointer"
                onClick={() => onDelete(book.id)}
              />
            </Tooltip>
          </Flex>
        </ListItem>
      ))}
    </List>
  )
}
