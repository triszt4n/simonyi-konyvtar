import { PrismaClient, Book } from '@prisma/client'
import nextConnect from 'next-connect'

const handler = nextConnect()
const db = new PrismaClient()

handler
  .get(async (req, res) => {
    try {
      const books = await db.book.findMany({ include: { categories: true } })
      res.json({ books })
    } catch (e) {
      console.error(e.message)
      res.status(500).send(e.message)
    }
  })
  .post(async (req, res) => {
    try {
      // TODO: validate book props here too!
      console.log(req.body)
      const { categories, ...rest }: { categories: { id: number }[], book: Book } = req.body
      const newBook = await db.book.create({
        data: {
          ...rest.book,
          categories: {
            connect: categories
          }
        }
      })
      // const newBook = await db.book.create({
      //   data: {
      //     title: 'Lorem ipsum',
      //     author: 'Dolor sit amet',
      //     isbn: 'aaabbbbcccc1234',
      //     categories: {
      //       connect: [{ id: 1 }, { id: 2 }]
      //     }
      //   }
      // })
      res.status(201).json({ book: newBook })

    } catch (e) {
      res.status(500).send(e.message)
      console.error(e.message)
    }
  })

export default handler
