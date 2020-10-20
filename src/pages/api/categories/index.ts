import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
const db = new PrismaClient()

handler
  .get(async (req, res) => {
    try {
      const categories = await db.category.findMany()
      res.json(categories)
    } catch (error) {
      console.error(error)
      res.status(500).send(error.message)
    }
  })
  .post(async (req, res) => {
    try {
      const name: string = req.body.name

      const category = await db.category.create({
        data: { name }
      })
      res.status(201).json({ category })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

export default handler
