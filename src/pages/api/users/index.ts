import nextConnect from 'next-connect'
import { PrismaClient, User, userrole } from '@prisma/client'
import argon2 from 'argon2'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'
import requireRole from 'middleware/requireRole'

const db = new PrismaClient()

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  .post(async (req, res) => {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
      return res.status(400).send('Missing fields')
    }
    // Security-wise, you must hash the password before saving it
    const hashedPass = await argon2.hash(password)
    const user = { name, password: hashedPass, email }
    let createdUser: User
    try {
      createdUser = await db.user.create({
        data: { ...user }
      })
    } catch (err) {
      console.error(err)
    }
    req.logIn(createdUser, (err) => {
      if (err) throw err
      // Log the signed up user in
      res.status(201).json({
        user,
      })
    })
  })
  .use(requireLogin)
  .use(requireRole(userrole.ADMIN))
  .get(async (req, res) => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      })

      res.json(users)
    } catch (e) {
      console.error(e)
      res.status(500).json({ messsage: e.message })
    }
  })

export default handler
