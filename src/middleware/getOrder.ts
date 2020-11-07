import nextConnect from 'next-connect'
import { PrismaClient, userrole } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'

const db = new PrismaClient()

const handler = nextConnect<NextApiRequest, NextApiResponse>()


handler
  .use(async (req, res, next) => {
    const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)
    req.order = await db.order.findOne({ where: { id } })
    next()
  })

export default handler
