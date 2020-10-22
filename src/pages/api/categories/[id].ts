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
  .put(async (req, res) => {
    try {
      const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)
      const name: string = req.body.name

      const category = await db.category.update({ where: { id }, data: { name } })
      res.json({ category })
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)
      await db.category.delete({ where: { id } })
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  })

export default handler
