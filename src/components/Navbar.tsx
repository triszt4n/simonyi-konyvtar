import { Box, Button, Flex, Link, Stack } from "@chakra-ui/react"
import NextLink from "next/link"
import Router from "next/router"
import { useState } from "react"
import { HiOutlineMenu, HiOutlineShoppingCart, HiX } from "react-icons/hi"

import { DarkModeSwitch } from "components/DarkModeSwitch"
import HasRole from "components/HasRole"
import { useCart, useUser } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, { mutate }] = useUser()
  const { cart } = useCart()

  Router.events.on("routeChangeStart", () => {
    setIsOpen(false)
  })

  async function handleLogout() {
    await fetch("/api/logout")
    mutate({ user: null })
  }

  return (
    <Box
      px={5}
      py={4}
      w="100%"
      display={["block", null, "flex"]}
      alignItems="center"
      justifyContent={[null, null, "space-between"]}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <NextLink href="/">
          <Link fontSize="lg">Simonyi Könyvtár</Link>
        </NextLink>
        <Stack direction="row" align="center" spacing={4}>
          <DarkModeSwitch display={["flex", null, "none"]} />
          <Box
            cursor="pointer"
            display={["block", null, "none"]}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiOutlineMenu />}
          </Box>
        </Stack>
      </Flex>
      <Stack
        as={Flex}
        shouldWrapChildren
        spacing={[4, null, 8]}
        alignItems={["start", null, "center"]}
        display={[isOpen ? "flex" : "none", null, "flex"]}
        direction={["column", null, "row"]}
        pt={[2, 0]}
      >
        {user && (
          <NextLink href="/orders">
            <Link>Kölcsönzéseim</Link>
          </NextLink>
        )}
        {user && (
          <NextLink href="/profile">
            <Link>Profilom</Link>
          </NextLink>
        )}
        {user && <Link onClick={handleLogout}>Kijelentkezés</Link>}
        {!user && (
          <NextLink href="/signup">
            <Link>Regisztráció</Link>
          </NextLink>
        )}
        {!user && (
          <NextLink href="/login">
            <Link>Bejelentkezés</Link>
          </NextLink>
        )}
        {user && (
          <HasRole roles={[userrole.ADMIN, userrole.EDITOR]}>
            <NextLink href="/admin">
              <Link>Admin</Link>
            </NextLink>
          </HasRole>
        )}
        <NextLink href="/cart">
          <Button leftIcon={<HiOutlineShoppingCart />}>{cart.sumCount}</Button>
        </NextLink>
      </Stack>
      <DarkModeSwitch display={["none", null, "block"]} />
    </Box>
  )
}
