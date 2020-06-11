import { PrismaClient } from '@prisma/client'
import nextConnect from 'next-connect'

const handler = nextConnect()
const db = new PrismaClient()

handler
  .get(async (req, res) => {
    const { query: { id }, } = req
    // This hack is needed because `id` has type string | string[]
    const bookId = parseInt((Array.isArray(id) ? id[0] : id))
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
  })

export default handler
