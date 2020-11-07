import nextConnect from 'next-connect'
import { PrismaClient, userrole } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'
import requireRole from 'middleware/requireRole'

const db = new PrismaClient()

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .use(requireRole(userrole.ADMIN))
  .get(async (req, res) => {
    try {
      const { query: { id }, } = req
      if (!id) return res.json(null)
      const userId = parseInt((Array.isArray(id) ? id[0] : id))
      const user = await db.user.findOne({ where: { id: userId } })

      res.json(user)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .put(async (req, res) => {
    try {
      const updated = await db.user.update({
        where: { id: parseInt(req.body.id) },
        data: { ...req.body }
      })
      res.json(updated)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
