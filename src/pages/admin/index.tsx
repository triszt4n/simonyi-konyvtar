import { List, ListItem } from "@chakra-ui/core"
import NextLink from "next/link"

export default function AdminIndex() {
  return (
    <List>
      <ListItem>
        <NextLink href="/admin/books">Konyvek</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/categories">Kategoriak</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/orders">Kolcsonzesek (TODO)</NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/admin/users">Felhasznalok (TODO)</NextLink>
      </ListItem>
    </List>
  )
}
