import { PrismaClient } from '@prisma/client'
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
      // const book = req.body
      // validate, insert categories too!
      // const newBook = await db.book.create({ ...book })
      const newBook = await db.book.create({
        data: {
          title: 'A very informative book',
          isbn: '1234abcd',
          author: 'Teszt Elek',
          comment: 'rafolyt a sor',
          image: 'https://www.pdf-archive.com/2017/12/29/gajdos-sandor-adatbazisok-uj-kiadas/preview-gajdos-sandor-adatbazisok-uj-kiadas-1.jpg',
        }
      })
      res.status(201).json({ book: newBook })

    } catch (e) {
      res.status(500).send(e.message)
      console.error(e.message)
    }
  })

export default handler
