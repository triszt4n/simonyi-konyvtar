import nextConnect, { NextHandler } from 'next-connect'
import { PrismaClient, userrole } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'

const db = new PrismaClient()

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const orderId = Number(req.query.orderId)
    const order = await db.order.findOne({ where: { id: orderId } })
    if (role === userrole.ADMIN || role === userrole.EDITOR || req.user.id === order.userId) {
      next()
    } else {
      res.status(401).send('unauthorized')
    }
  })
  .get(async (req, res) => {
    try {
      const orderId = Number(req.query.orderId)
      const order = await db.order.findOne({
        where: { id: orderId },
        include: { books: { include: { books: true } } }
      })
      res.json(order)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
