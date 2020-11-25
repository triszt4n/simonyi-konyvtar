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
      const { books, returnDate } = JSON.parse(req.body) as {
        books: CartItem[],
        returnDate: Date
      }

      for await (const book of books) {
        const b = await db.book.findUnique({ where: { id: book.id } })
        if (book.quantity > b.stockCount) {
          return res
            .status(422)
            .json({
              message: `A(z) ${book.title} könyvből csak ${b.stockCount} van raktáron`
            })
        }
      }

      const createOrder = db.order.create({
        data: {
          returnDate,
          user: {
            connect: { id: userId },
          },
          books: {
            create: books.map(it => ({
              quantity: it.quantity,
              books: {
                connect: { id: it.id },
              }
            })),
          }
        },
      })

      const bookUpdates = books.map(book => {
        const bookUpdate = db.book.update({
          where: { id: book.id },
          data: {
            stockCount: { decrement: book.quantity }
          }
        })
        return bookUpdate
      })

      // @ts-ignore
      const [order] = await db.$transaction([createOrder, ...bookUpdates])

      res.json(order)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .use(requireRole(userrole.ADMIN, userrole.EDITOR))
  .get(async (req, res) => {
    try {
      const orders = await db.order.findMany({
        include: {
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
      res.json(orders)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
