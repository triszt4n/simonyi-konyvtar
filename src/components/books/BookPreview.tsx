import { Box, Stack, Heading, Tag, Text, Wrap, WrapItem, chakra } from "@chakra-ui/react"
import { motion } from "framer-motion"
import NextImage from "next/image"
import NextLink from "next/link"

import { BookWithCategories } from "lib/interfaces"

const MotionBox = chakra(motion.div)

interface BookPreviewProps {
  book: BookWithCategories
}

export const BookPreview = ({ book }: BookPreviewProps) => {
  return (
    <NextLink href="/books/[id]" as={`/books/${book.id}`}>
      <MotionBox
        p={4}
        rounded="md"
        cursor="pointer"
        whileHover={{
          boxShadow: "0px 0px 8px lightgray",
        }}
        maxW="xs"
      >
        <Box pr={2}>
          <NextImage
            width={150}
            height={225}
            src={
              book.image
                ? `${process.env.NEXT_PUBLIC_S3_URL}/${book.image}`
                : "https://placekitten.com/200/300"
            }
          />
        </Box>
        <Stack direction="column" spacing={2}>
          <Heading as="h3" size="md">
            {book.title}
          </Heading>
          <Text size="sm">{book.author}</Text>
          <Text>{book.stockCount || 0} db elérhető</Text>
        </Stack>
        <Wrap mt={2}>
          {book.categories?.map((it) => (
            <WrapItem key={it.id}>
              <Tag>{it.name}</Tag>
            </WrapItem>
          ))}
        </Wrap>
      </MotionBox>
    </NextLink>
  )
}
