import { userrole } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

import { BookWithCategories, BookWithCategoryIds } from "lib/interfaces"
import db from "lib/db"
import parseMultipart from "lib/parseMultipart"
import { uploadToS3 } from "lib/s3"
import { BookSchema } from "lib/schemas"
import auth from "middleware/auth"
import requireLogin from "middleware/requireLogin"
import requireRole from "middleware/requireRole"

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .get(async (req, res) => {
    const { query: { id }, } = req
    const bookId = Number(id)
    if (isNaN(bookId)) {
      res.status(500).json("ID must be number")
    } else {
      try {
        const book = await db.book.findUnique({
          where: { id: bookId },
          include: {
            categories: true,
            orders: { include: { orders: true } }
          }
        })
        res.json(book)
      } catch (e) {
        console.error(e)
        res.status(500).json(e.message)
      }
    }
  })
  .use(auth())
  .use(requireLogin())
  .use(requireRole(userrole.ADMIN, userrole.EDITOR))
  .put(async (req, res) => {
    try {
      const { query: { id }, } = req
      const bookId = Number(id)

      const { parsedFields, parsedFiles } = await parseMultipart<BookWithCategoryIds>(req)
      const { categories, ...bookUpdate } = parsedFields
      bookUpdate.count = Number(bookUpdate.count)
      bookUpdate.stockCount = Number(bookUpdate.stockCount)
      bookUpdate.publishedAt = Number(bookUpdate.publishedAt)

      const isValid = BookSchema.isValid(bookUpdate)

      if (!isValid) {
        res.status(400).json({ message: "Nem megfelelő formátum" })
      }

      // @ts-ignore
      const parsedCategories = JSON.parse(categories) as { id: number }[]

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

      const book: BookWithCategories = await db.book.findUnique({
        where: { id: bookId },
        include: { categories: true }
      })
      const removedCategories: { id: number }[] = book.categories.reduce((acc, val) => {
        if (!parsedCategories.some(it => it.id === val.id)) {
          acc.push({ id: val.id })
        }
        return acc
      }, [])


      const updatedBook = await db.book.update({
        where: { id: bookId },
        data: {
          ...bookUpdate,
          image: key || book.image,
          updatedAt: new Date(),
          categories: {
            connect: parsedCategories,
            disconnect: removedCategories
          }
        }
      })

      res.status(200).json(updatedBook)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })
  .delete(async (req, res) => {
    const { query: { id } } = req
    const bookId = Number(id)
    const book: BookWithCategories = await db.book.findUnique({
      where: { id: bookId },
      include: { categories: true }
    })

    try {
      const disconnectCategories = db.book.update({
        where: { id: bookId },
        data: {
          categories: {
            disconnect: book.categories.map(it => ({ id: it.id }))
          },
        },
      })

      const removeBook = db.book.delete({
        where: { id: bookId },
      })

      const result = await db.$transaction([disconnectCategories, removeBook])

      res.status(204).json(result[1])
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: err.message })
    }
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
