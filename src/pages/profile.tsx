import { Button, Stack, Text, Input } from "@chakra-ui/core"
import Router from "next/router"
import { useEffect, useState } from "react"

import { useUser } from "lib/hooks"

export default function ProfilePage() {
  const [user, { loading, mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState("")

  async function handleDeleteProfile() {
    const res = await fetch(`/api/user`, {
      method: "DELETE",
    })

    if (res.status === 204) {
      mutate({ user: null })
      Router.replace("/")
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const body = {
      // password: e.currentTarget.password.value,
      name: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
    }

    // if (body.password !== e.currentTarget.rpassword.value) {
    //   setErrorMsg(`The passwords don't match`)
    //   return
    // }

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const userObj = await res.json()
      // set user to useSWR state
      mutate(userObj)
    } else {
      setErrorMsg(await res.text())
    }
  }

  useEffect(() => {
    // todo: fix weird redirect on edit
    // redirect user to login if not authenticated
    if (!loading && !user) Router.replace("/login")
  }, [user, loading])

  return (
    <>
      <h1>Profile</h1>
      {user && (
        <>
          <p>Your profile: {JSON.stringify(user)}</p>
          {errorMsg && <Text color="tomato">{errorMsg}</Text>}
          <form onSubmit={onSubmit}>
            <Stack spacing={3} shouldWrapChildren>
              <Input
                variant="outline"
                type="text"
                name="username"
                placeholder="Name"
                defaultValue={user.name}
                isRequired
              />
              <Input
                variant="outline"
                type="text"
                name="email"
                value={user.email}
                isRequired
                isReadOnly
              />
              {/* <Input
                variant="outline"
                type="password"
                name="password"
                placeholder="Password"
                isRequired
              />
              <Input
                variant="outline"
                type="password"
                name="rpassword"
                placeholder="Repeat password"
                isRequired
              /> */}
              <Button type="submit">Mentés</Button>
            </Stack>
          </form>
          <Button color="tomato" onClick={handleDeleteProfile}>
            Delete profile
          </Button>
        </>
      )}
    </>
  )
}
