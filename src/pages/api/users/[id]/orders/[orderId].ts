import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect, { NextHandler } from "next-connect"

import db from "lib/db"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth())
  .use(requireLogin())
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const role = req.user.role
    const orderId = Number(req.query.orderId)
    const order = await db.order.findUnique({ where: { id: orderId } })
    if (role === userrole.ADMIN ||
      role === userrole.EDITOR ||
      req.user.id === order.userId) {
      next()
    } else {
      res.status(401).json({ message: "Nincs megfelelő jogosultságod" })
    }
  })

export default handler
