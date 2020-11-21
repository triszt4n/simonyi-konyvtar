import {
  List,
  ListItem,
  IconButton,
  Text,
  Flex,
  Link,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { HiPencilAlt, HiTrash } from "react-icons/hi"

import { BookWithCategories } from "lib/interfaces"
import NextLink from "next/link"

interface Props {
  data: BookWithCategories[]
  onDelete: (id: number) => void
}

export function BookList({ data, onDelete }: Props) {
  return (
    <List spacing={4}>
      {data.map((book) => (
        <ListItem key={book.id}>
          <Flex
            direction={["column", "row"]}
            justify="space-between"
            alignItems={["start", "center"]}
          >
            <Stack direction="row" spacing={2} align="center" mb={[2, 0]}>
              <Text>#{book.id}</Text>
              <NextLink href={`/books/${book.id}`}>
                <Link fontSize="lg">{book.title}</Link>
              </NextLink>
            </Stack>
            <Stack direction="row" spacing={4}>
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
            </Stack>
          </Flex>
        </ListItem>
      ))}
    </List>
  )
}
