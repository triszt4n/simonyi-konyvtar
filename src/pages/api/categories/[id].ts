import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

import db from "lib/db"
import { CategorySchema } from "lib/schemas"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"
import requireRole from "middleware/requireRole"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .use(requireLogin)
  .use(requireRole(userrole.ADMIN))
  .put(async (req, res) => {
    try {
      const isValid = CategorySchema.isValid(req.body)
      if (!isValid) {
        res.status(400).json({ message: "Nem megfelelő formátum" })
      }
      const id = Number(req.query.id)
      const name: string = req.body.name

      const category = await db.category.update({ where: { id }, data: { name } })
      res.json({ category })
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const id = Number(req.query.id)
      await db.category.delete({ where: { id } })
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  })

export default handler
