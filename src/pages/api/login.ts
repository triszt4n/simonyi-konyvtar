import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from '../../middleware/auth'
import passport from '../../lib/passport'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.use(auth).post(passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user })
})

export default handler
