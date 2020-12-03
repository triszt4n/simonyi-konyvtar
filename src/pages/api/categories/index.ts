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
  .use(auth())
  .use(requireLogin())
  .use(requireRole(userrole.ADMIN))
  .get(async (req, res) => {
    try {
      const categories = await db.category.findMany()
      res.json(categories)
    } catch (error) {
      console.error(error)
      res.status(500).send(error.message)
    }
  })
  .post(async (req, res) => {
    try {
      const isValid = CategorySchema.isValid(req.body)
      if (!isValid) {
        res.status(400).json({ message: "Nem megfelelő formátum" })
      }

      const category = await db.category.create({
        data: { name: req.body.name }
      })
      res.status(201).json(category)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

export default handler
