import { PrismaClient } from '@prisma/client'
import nextConnect from 'next-connect'

import { BookWithCategories } from '../../../lib/interfaces'

const handler = nextConnect()
const db = new PrismaClient()

handler
  .get(async (req, res) => {
    const { query: { id }, } = req
    // This hack is needed because `id` has type string | string[]
    const bookId = parseInt((Array.isArray(id) ? id[0] : id))
    if (isNaN(bookId)) {
      res.status(500).json('ID must be number')
    } else {
      try {
        const book = await db.book.findOne({
          where: { id: bookId },
          include: { categories: true }
        })
        res.json({ book })
      } catch (e) {
        console.error(e)
        res.status(500).json(e.message)
      }
    }
  })
  .delete(async (req, res) => {
    const { query: { id } } = req
    const bookId = parseInt((Array.isArray(id) ? id[0] : id))
    const book: BookWithCategories = await db.book.findOne({ where: { id: bookId }, include: { categories: true } })

    try {
      await db.book.update({
        where: { id: bookId },
        data: {
          categories: {
            disconnect: book.categories.map(it => ({ id: it.id }))
          },
        },
      })

      const removedBook = await db.book.delete({
        where: { id: bookId },
      })

      res.status(204).json({ book: removedBook })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: err.message })
    }
  })

export default handler
