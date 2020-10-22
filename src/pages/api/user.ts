import { PrismaClient } from '@prisma/client'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
const db = new PrismaClient()

handler
  .use(auth)
  .get(async (req, res) => {
    // You do not generally want to return the whole user object
    // because it may contain sensitive field such as !!password!! Only return what needed
    if (req.user) {
      const { password, ...rest } = req.user
      res.json({ user: rest })
    } else {
      res.json(null)
    }
  })
  .use(requireLogin)
  .delete(async (req, res) => {
    await db.user.delete({ where: { id: req.user.id } })
    req.logOut()
    res.status(204).end()
  })
  .post(async (req, res) => {
    try {
      const { password, ...rest } = await db.user.update({
        where: { id: req.user.id },
        data: {
          name: req.body.name,
        }
      })

      res.json(rest)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
