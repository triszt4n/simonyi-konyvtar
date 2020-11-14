import {
  Button,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import NextLink from "next/link"
import Router from "next/router"
import { useEffect, useState } from "react"
import { HiEye, HiEyeOff } from "react-icons/hi"

import { useUser } from "lib/hooks"

export default function LoginPage() {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState("")
  const [show, setShow] = useState(false)

  const toggleShowPassword = () => setShow(!show)

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push("/")
  }, [user])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    }
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.status === 200) {
      const userObj = await res.json()
      // set user to useSWR state
      mutate(userObj)
    } else {
      setErrorMsg("Nem megfelelő email vagy jelszó")
    }
  }

  return (
    <>
      <Heading as="h1">Bejelentkezés</Heading>
      {errorMsg && <Text color="tomato">{errorMsg}</Text>}
      <form onSubmit={onSubmit}>
        <Stack spacing={3} shouldWrapChildren>
          <Input
            variant="outline"
            placeholder="Email"
            name="email"
            isRequired
          />
          <InputGroup>
            <Input
              variant="outline"
              placeholder="Jelszó"
              name="password"
              type={show ? "text" : "password"}
              isRequired
            />
            <InputRightElement>
              <IconButton
                aria-label="Jelszó mutatása"
                icon={show ? <HiEyeOff /> : <HiEye />}
                onClick={toggleShowPassword}
              />
            </InputRightElement>
          </InputGroup>
          <Button type="submit">Bejelentkezés</Button>
          <NextLink href="/signup">
            <Link>Még nincs fókom</Link>
          </NextLink>
        </Stack>
      </form>
    </>
  )
}
