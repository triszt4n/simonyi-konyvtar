import {
  Flex,
  IconButton,
  List,
  ListItem,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/core"
import { Category } from "@prisma/client"

interface Props {
  data: Category[]
  handleDelete: (c: Category) => void
  handleEdit: (c: Category) => void
}

export function CategoryList({ data, handleDelete, handleEdit }: Props) {
  return (
    <List>
      {data.map(({ id, name }) => (
        <ListItem key={id}>
          <Stack spacing={4} isInline as={Flex} alignItems="center">
            <Text>#{id}</Text>
            <Text>{name}</Text>
            <Tooltip
              label="Szerkesztés"
              aria-label="Szerkesztés"
              placement="top"
            >
              <IconButton
                aria-label="szerkesztés"
                icon="edit"
                onClick={() => handleEdit({ id, name })}
              />
            </Tooltip>
            <Tooltip label="Törlés" aria-label="Törlés" placement="top">
              <IconButton
                aria-label="törlés"
                icon="delete"
                variantColor="red"
                onClick={() => handleDelete({ id, name })}
              />
            </Tooltip>
          </Stack>
        </ListItem>
      ))}
    </List>
  )
}
