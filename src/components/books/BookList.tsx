import {
  List,
  ListItem,
  IconButton,
  Text,
  Flex,
  Stack,
  Link,
  Tooltip,
} from "@chakra-ui/core"
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
          <Flex
            as={Stack}
            justifyContent="space-around"
            alignItems="center"
            flexDir="row"
          >
            <Text>#{book.id}</Text>
            <NextLink href={`/books/${book.id}`}>
              <Link>{book.title}</Link>
            </NextLink>
            <NextLink href={`/admin/books/${book.id}/edit`}>
              <IconButton aria-label="szerkesztés" icon="edit" />
            </NextLink>
            <Tooltip label="Törlés" aria-label="Törlés" placement="top">
              <IconButton
                aria-label="törlés"
                icon="delete"
                variantColor="red"
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
