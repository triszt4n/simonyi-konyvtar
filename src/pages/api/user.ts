import argon2 from 'argon2'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import db from 'lib/db'
import auth from 'middleware/auth'
import requireLogin from 'middleware/requireLogin'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

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
  .put(async (req, res) => {
    try {
      const { name, password, newpassword } = req.body
      if (!name) {
        return res.status(400).send('A név nem lehet üres')
      }
      if (password && !(await argon2.verify(req.user.password, password))) {
        return res.status(400).send('A régi jelszó nem megfelelő')
      }
      if (password && !newpassword) {
        return res.status(400).send('Az új jelszó nem lehet üres')
      }
      // Security-wise, you must hash the password before saving it
      const hashedPass = await argon2.hash(newpassword)
      const user = { name }
      if (password) {
        // @ts-ignore
        user.password = hashedPass
      }
      const { password: pass, ...rest } = await db.user.update({
        where: { id: req.user.id },
        data: {
          ...user
        }
      })

      res.json(rest)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: e.message })
    }
  })

export default handler
