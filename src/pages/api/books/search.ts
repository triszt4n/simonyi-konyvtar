import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import escape from "pg-escape"

import db from "lib/db"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .get(async (req, res) => {
    try {
      const term = req.query.q
      const sql = escape(`
      select id, title, author, "stockCount", "updatedAt", image
        from "Book"
        where document_with_idx @@ plainto_tsquery('%s')
        order by ts_rank(document_with_idx, plainto_tsquery('%s')) desc;`, term, term)

      const books = await db.$queryRaw(sql)

      console.log(books)

      res.json(books)

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "oops" })
    }
  })

export default handler
