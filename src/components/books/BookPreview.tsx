import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Stack,
  Tag,
  Text,
  Image,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import NextLink from "next/link"

import { BookWithCategories } from "lib/interfaces"
import TimeAgo from "components/HunTimeAgo"

const MotionBox = motion.custom(Box)

interface BookPreviewProps {
  book: BookWithCategories
}

export const BookPreview = ({ book }: BookPreviewProps) => {
  return (
    <NextLink href="/books/[id]" as={`/books/${book.id}`}>
      <MotionBox
        padding="0.7rem"
        borderRadius="4px"
        whileHover={{
          boxShadow: "0px 0px 8px lightgray",
        }}
      >
        <Flex>
          <Image
            pr={2}
            maxH="14rem"
            src={
              book.image
                ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.image}`
                : "https://placekitten.com/200/300"
            }
          />
          <List spacing={4}>
            <ListItem>
              <Heading as="h3" size="lg">
                {book.title}
              </Heading>
            </ListItem>
            <ListItem>
              <Heading as="h4" size="sm">
                {book.author}
              </Heading>
            </ListItem>
            <ListItem>
              <Text>Készleten: {book.stockCount || 0}</Text>
            </ListItem>
          </List>
        </Flex>
        <Stack spacing={4} isInline mt={2}>
          {book.categories?.map((it) => (
            <Tag key={it.id}>{it.name}</Tag>
          ))}
        </Stack>
        <Text mt={2} opacity={0.7} fontSize="sm">
          Legutóbb frissítve:&nbsp;
          <TimeAgo date={book.updatedAt} />
        </Text>
      </MotionBox>
    </NextLink>
  )
}
