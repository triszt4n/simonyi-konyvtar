import { Button, Heading, Input, Link, Stack, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import Router from "next/router"
import { useEffect, useState } from "react"

import { useUser } from "lib/hooks"

export default function SignupPage() {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push("/")
  }, [user])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const body = {
      password: e.currentTarget.password.value,
      name: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
    }

    if (body.password !== e.currentTarget.rpassword.value) {
      setErrorMsg("A megadott jelszavak nem egyeznek")
      return
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.status === 201) {
      const userObj = await res.json()
      // set user to useSWR state
      mutate(userObj)
    } else {
      setErrorMsg(await res.text())
    }
  }

  return (
    <>
      <Heading as="h1">Regisztráció</Heading>
      {errorMsg && <Text color="tomato">{errorMsg}</Text>}
      <form onSubmit={onSubmit}>
        <Stack spacing={3} shouldWrapChildren>
          <Input
            variant="outline"
            type="text"
            name="username"
            placeholder="Név"
            isRequired
          />
          <Input
            variant="outline"
            type="text"
            name="email"
            placeholder="Email"
            isRequired
          />
          <Input
            variant="outline"
            type="password"
            name="password"
            placeholder="Jelszó"
            isRequired
          />
          <Input
            variant="outline"
            type="password"
            name="rpassword"
            placeholder="Jelszó újra"
            isRequired
          />
          <Button type="submit">Regisztráció</Button>
          <NextLink href="/login">
            <Link>Már van fiókom</Link>
          </NextLink>
        </Stack>
      </form>
    </>
  )
}
