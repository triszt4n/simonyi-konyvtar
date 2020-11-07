import nextConnect, { NextHandler } from 'next-connect'
import { PrismaClient, userrole } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'
import requireRole from 'middleware/requireRole'

const db = new PrismaClient()

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .put(async (req, res) => {
    // TODO
  })
  .delete(async (req, res) => {
    // TODO
  })
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const orderId = Number(req.query.id)
    const order = await db.order.findOne({ where: { id: orderId } })
    if (role === userrole.ADMIN || role === userrole.EDITOR || req.user.id === order.userId) {
      next()
    } else {
      res.status(401).send('unauthorized')
    }
  })
  .get(async (req, res) => {
    try {
      const id = Number(req.query.id)
      const order = await db.order.findOne({ where: { id }, include: { comments: true, books: { include: { books: true } } } })
      res.json(order)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
