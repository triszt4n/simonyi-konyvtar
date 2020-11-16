import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

import { BookWithCategoryIds } from "lib/interfaces"
import db from "lib/db"
import parseMultipart from "lib/parseMultipart"
import { uploadToS3 } from "lib/s3"
import auth from "middleware/auth"
import { BookSchema } from "lib/schemas"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .get(async (req, res) => {
    try {
      const books = await db.book.findMany({ include: { categories: true, } })
      res.json(books)
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })
  .post(async (req, res) => {
    try {
      // TODO: validate book params
      const { parsedFields, parsedFiles } = await parseMultipart<BookWithCategoryIds>(req)
      const { categories, ...rest } = parsedFields
      rest.count = Number(rest.count)
      rest.stockCount = Number(rest.stockCount)
      rest.publishedAt = Number(rest.publishedAt)

      const isValid = BookSchema.isValid(rest)

      if (!isValid) {
        res.status(400).json({ message: "Nem megfelelő formátum" })
      }

      // @ts-ignore
      const parsedCategories = JSON.parse(categories)

      let key = ""

      if (parsedFiles.length) {
        const file = parsedFiles[0]
        key = await uploadToS3({
          body: file.body,
          contentType: file.contentType,
          metadata: {
            creator: req.user.id.toString(),
            createdAt: Date.now().toString(),
            originalName: file.originalName,
          },
          contentDisposition: `inline; filename="${file.originalName}"`,
        })
      }

      const newBook = await db.book.create({
        data: {
          ...rest,
          image: key,
          categories: {
            connect: parsedCategories
          }
        }
      })

      res.status(201).json({ book: newBook })
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: e.message })
    }
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler