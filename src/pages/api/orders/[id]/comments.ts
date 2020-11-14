import nextConnect, { NextHandler } from "next-connect"
import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import db from "lib/db"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const orderId = Number(req.query.id)
    const order = await db.order.findOne({ where: { id: orderId } })
    if (role === userrole.ADMIN ||
      role === userrole.EDITOR ||
      req.user.id === order.userId) {
      next()
    } else {
      res.status(401).send("unauthorized")
    }
  })
  .post(async (req, res) => {
    const orderId = Number(req.query.id)
    try {
      const comment = await db.comment.create({
        data: {
          text: req.body.comment,
          order: { connect: { id: orderId } },
          user: { connect: { id: req.user.id } }
        }
      })
      res.json({ ...comment, user: req.user })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .get(async (req, res) => {
    try {
      const orderId = Number(req.query.id)
      const comments = await db.comment.findMany({
        where: { orderId: orderId },
        include: { user: true }
      })
      res.json(comments)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
