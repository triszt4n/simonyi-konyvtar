import { PrismaClient } from '@prisma/client'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import auth from 'middleware/auth'

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
  .use((req, res, next) => {
    // handlers after this (PUT, DELETE) all require an authenticated user
    // This middleware to check if user is authenticated before continuing
    if (!req.user) {
      res.status(401).send('unauthenticated')
    } else {
      next()
    }
  })
  .delete(async (req, res) => {
    await db.user.delete({ where: { id: req.user.id } })
    req.logOut()
    res.status(204).end()
  })

export default handler
