import nextConnect from "next-connect"
import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import db from "lib/db"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"
import requireRole from "middleware/requireRole"
import { CartItem } from "lib/interfaces"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .post(async (req, res) => {
    try {
      const userId = req.user.id
      const books = JSON.parse(req.body) as CartItem[]

      const createdOrder = await db.order.create({
        data: {
          returnDate: new Date(), // TODO
          user: {
            connect: { id: userId },
          },
          books: {
            create: books.map(it => ({
              quantity: it.quantity,
              books: { connect: { id: it.id } }
            }))
          }
        },
      })

      res.json(createdOrder)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .use(requireRole(userrole.ADMIN, userrole.EDITOR))
  .get(async (req, res) => {
    try {
      const orders = await db.order.findMany({
        include: { books: { include: { books: true } } }
      })
      res.json(orders)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
