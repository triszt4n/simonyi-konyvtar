import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

const requireLogin = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (!req.user) {
    res.status(401).send('unauthenticated')
  } else {
    next()
  }
}

export default requireLogin
