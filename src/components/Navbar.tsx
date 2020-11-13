import { Button, Flex, Link, Stack } from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react"
import { HiOutlineShoppingCart } from "react-icons/hi"

import { DarkModeSwitch } from "components/DarkModeSwitch"
import { useCart, useUser } from "lib/hooks"
import HasRole from "./HasRole"
import { userrole } from "lib/prismaClient"

export default function Navbar() {
  const [user, { mutate }] = useUser()
  const { cart } = useCart()

  async function handleLogout() {
    await fetch("/api/logout")
    mutate({ user: null })
  }

  return (
    <Flex
      w="100%"
      px={5}
      py={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack shouldWrapChildren spacing={8} direction="row" alignItems="center">
        <NextLink href="/">
          <Link>Simonyi Könyvtár</Link>
        </NextLink>
        {user ? (
          <Stack shouldWrapChildren spacing={8} direction="row">
            <NextLink href="/profile">
              <Link>Profilom</Link>
            </NextLink>
            <Link onClick={handleLogout}>Kijelentkezés</Link>
            <NextLink href="/orders">
              <Link>Kölcsönzéseim</Link>
            </NextLink>
          </Stack>
        ) : (
          <Stack shouldWrapChildren spacing={8} direction="row">
            <NextLink href="/signup">
              <Link>Regisztráció</Link>
            </NextLink>
            <NextLink href="/login">
              <Link>Bejelentkezés</Link>
            </NextLink>
          </Stack>
        )}
        <HasRole roles={[userrole.ADMIN]}>
          <NextLink href="/admin">
            <Link>Admin</Link>
          </NextLink>
        </HasRole>
        <NextLink href="/cart">
          <Button leftIcon={<HiOutlineShoppingCart />}>{cart.sumCount}</Button>
        </NextLink>
      </Stack>
      <DarkModeSwitch />
    </Flex>
  )
}
