import { Flex, IconButton, List, ListItem, Stack, Text, Tooltip } from "@chakra-ui/react"
import { Category } from "@prisma/client"
import { HiPencilAlt, HiTrash } from "react-icons/hi"

interface Props {
  data: Category[]
  handleDelete: (c: Category) => void
  handleEdit: (c: Category) => void
}

export function CategoryList({ data, handleDelete, handleEdit }: Props) {
  return (
    <List>
      {data.map(({ id, name }) => (
        <ListItem key={id} mb={4}>
          <Flex
            direction={["column", "row"]}
            justify="space-between"
            alignItems={["start", "center"]}
          >
            <Stack direction="row" spacing={2} align="center" mb={[2, 0]}>
              <Text>#{id}</Text>
              <Text fontSize="lg">{name}</Text>
            </Stack>
            <Stack spacing={4} direction="row">
              <Tooltip label="Szerkesztés" aria-label="Szerkesztés" placement="top">
                <IconButton
                  aria-label="szerkesztés"
                  icon={<HiPencilAlt />}
                  onClick={() => handleEdit({ id, name })}
                />
              </Tooltip>
              <Tooltip label="Törlés" aria-label="Törlés" placement="top">
                <IconButton
                  aria-label="törlés"
                  icon={<HiTrash />}
                  colorScheme="red"
                  onClick={() => handleDelete({ id, name })}
                />
              </Tooltip>
            </Stack>
          </Flex>
        </ListItem>
      ))}
    </List>
  )
}
