import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect, { NextHandler } from "next-connect"

import db from "lib/db"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const userId = Number(req.query.id)

    if (role === userrole.ADMIN || role === userrole.EDITOR || req.user.id === userId) {
      next()
    } else {
      res.status(401).send("unauthorized")
    }
  })
  .get(async (req, res) => {
    try {
      const orders = await db.order.findMany({
        where: { userId: req.user.id },
        include: { books: { include: { books: true } } },
        orderBy: { createdAt: "desc" }
      })
      res.json(orders)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
