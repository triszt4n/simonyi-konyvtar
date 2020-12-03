import passport from "passport"
import { Strategy } from "passport-local"
import { NextApiRequest } from "next"
import { User } from "@prisma/client"
import argon2 from "argon2"

import db from "lib/db"

passport.serializeUser((user: User, done) => {
  // serialize the username into session
  done(null, user.id)
})

passport.deserializeUser(async (req: NextApiRequest, id: number, done) => {
  // deserialize the username back into user object
  const user = await db.user.findUnique({ where: { id } })
  done(null, user)
})

passport.use(
  new Strategy(
    { passReqToCallback: true, usernameField: "email", },
    async (req, email, password, done) => {
      // Here you lookup the user in your DB and compare the password/hashed password
      const user = await db.user.findUnique({ where: { email } })
      // Security-wise, if you hashed the password earlier, you must verify it

      if (!user || !(await argon2.verify(user.password, password))) {
        done(null, null)
      } else {
        done(null, user)
      }
    }
  )
)

export default passport
