import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import NextImage from "next/image"
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
          <Box pr={2}>
            <NextImage
              width={200}
              height={300}
              src={
                book.image
                  ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.image}`
                  : "https://placekitten.com/200/300"
              }
            />
          </Box>
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
        <Wrap mt={2}>
          {book.categories?.map((it) => (
            <WrapItem key={it.id}>
              <Tag>{it.name}</Tag>
            </WrapItem>
          ))}
        </Wrap>
        <Text mt={2} opacity={0.7} fontSize="sm">
          Legutóbb frissítve:&nbsp;
          <TimeAgo date={book.updatedAt} />
        </Text>
      </MotionBox>
    </NextLink>
  )
}
