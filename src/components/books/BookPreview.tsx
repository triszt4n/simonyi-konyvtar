import {
  Box,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/core'
import { motion } from 'framer-motion'
import NextLink from 'next/link'

import { BookWithCategories } from '../../lib/interfaces'
import TimeAgo from '../HunTimeAgo'

const MotionBox = motion.custom(Box)

interface BookPreviewProps {
  book: BookWithCategories
}

export const BookPreview: React.FC<BookPreviewProps> = ({ book }) => {
  return (
    <NextLink href='/books/[id]' as={`/books/${book.id}`}>
      <MotionBox
        padding='0.7rem'
        borderRadius='4px'
        cursor='pointer'
        whileHover={{
          boxShadow: '0px 0px 8px lightgray',
          scale: 1.02,
        }}
      >
        <Flex>
          <Image
            src={book.image || 'https://placekitten.com/200/300'}
            maxH='14rem'
            pr='1rem'
          />
          <List spacing={4}>
            <ListItem>
              <Heading as='h3' size='lg'>
                {book.title}
              </Heading>
            </ListItem>
            <ListItem>
              <Heading as='h4' size='sm'>
                {book.author}
              </Heading>
            </ListItem>
            <ListItem>
              <Text>Készleten: {book.stock || 0}</Text>
            </ListItem>
          </List>
        </Flex>
        <Stack spacing={4} isInline mt='0.5rem'>
          {book.categories?.map((it) => (
            <Tag key={it.id}>{it.name}</Tag>
          ))}
        </Stack>
        <Text mt='0.5rem' opacity={0.7} fontSize='sm'>
          Legutóbb frissítve:&nbsp;
          <TimeAgo date={book.updatedAt} />
        </Text>
      </MotionBox>
    </NextLink>
  )
}
