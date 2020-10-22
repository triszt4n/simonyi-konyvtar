import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { NextHandler } from "next-connect"

const requireRole = (...roles: userrole[]) => {
  return (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    if (!req.user) {
      return res.status(401).send('unauthenticated')
    }
    if (roles.some(it => it == req.user.role)) {
      return next()
    } else {
      return res.status(401).send('unauthorized')
    }
  }
}

export default requireRole
