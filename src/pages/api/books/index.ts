import { PrismaClient, Book } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
const db = new PrismaClient()

handler
  .get(async (req, res) => {
    try {
      const books = await db.book.findMany({ include: { categories: true, } })
      res.json({ books })
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })
  .post(async (req, res) => {
    try {
      // TODO: validate book props here!
      const { categories, publishedAt, count, stockCount, ...rest } = req.body

      const newBook = await db.book.create({
        data: {
          ...rest,
          publishedAt: parseInt(publishedAt),
          count: parseInt(count),
          stockCount: parseInt(stockCount),
          categories: {
            connect: categories
          }
        }
      })

      res.status(201).json({ book: newBook })
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
