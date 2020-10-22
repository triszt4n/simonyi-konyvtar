import { PrismaClient, userrole } from '@prisma/client'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'
import requireRole from 'middleware/requireRole'
import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
const db = new PrismaClient()

handler
  .use(auth)
  .use(requireLogin)
  .use(requireRole(userrole.ADMIN))
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
      const category = await db.category.create({
        data: { name: req.body.name }
      })
      res.status(201).json(category)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

export default handler
