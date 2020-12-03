import { Order, orderstatus, userrole } from "@prisma/client"
import nextConnect, { NextHandler } from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"

import db from "lib/db"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"
import requireRole from "middleware/requireRole"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth())
  .use(requireLogin())
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const orderId = Number(req.query.id)
    const order = await db.order.findUnique({ where: { id: orderId } })
    if (role === userrole.ADMIN ||
      role === userrole.EDITOR ||
      req.user.id === order.userId) {
      next()
    } else {
      res.status(401).json({ message: "Nincs megfelelő jogosultságod" })
    }
  })
  .get(async (req, res) => {
    try {
      const id = Number(req.query.id)
      const order = await db.order.findUnique({
        where: { id },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                }
              }
            }
          },
          books: { include: { books: true } },
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            }
          }
        }
      })

      res.json(order)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const orderId = Number(req.query.id)
      const orders = await db.bookToOrder.findMany({ where: { orderId } })
      const removeConnectedBooks = db.bookToOrder.deleteMany({ where: { orderId } })
      const removeOrder = db.order.delete({ where: { id: orderId } })
      const updateBooks = orders.map(o =>
        db.book.update({
          where: { id: o.bookId },
          data: { stockCount: { increment: o.quantity } }
        }))
      // @ts-ignore
      await db.$transaction([removeConnectedBooks, removeOrder, ...updateBooks])
      res.status(200).end()
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .use(requireRole(userrole.ADMIN, userrole.EDITOR))
  .put(async (req, res) => {
    const orderId = Number(req.query.id)
    const updates = JSON.parse(req.body) as Partial<Order>
    try {
      const transactions = []
      transactions.push(db.order.update({
        where: { id: orderId },
        data: {
          ...updates
        },
        include: { comments: true, books: { include: { books: true } } }
      }))
      if (updates.status === orderstatus.RETURNED) {
        const orders = await db.bookToOrder.findMany({ where: { orderId } })
        transactions.push(...orders.map(o =>
          db.book.update({
            where: { id: o.bookId },
            data: { stockCount: { increment: o.quantity } }
          })))
      }
      const [order] = await db.$transaction(transactions)
      res.json(order)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

export default handler
