import { NextApiRequest, NextApiResponse } from "next"
import { NextHandler } from "next-connect"

const requireLogin = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (!req.user) {
    res.status(401).send({ message: "Az oldal megtekintéséhez be kell jelentkezned" })
  } else {
    next()
  }
}

export default requireLogin
