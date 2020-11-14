import { Heading } from "@chakra-ui/react"
import { User } from "@prisma/client"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"

import ErrorPage from "components/ErrorPage"
import Loading from "components/Loading"
import { fetcher, useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function UserPage() {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return (
      <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
    )
  }

  const router = useRouter()
  const userId = router.query.id
  const { data: user, error } = useSWR<User>(`/api/users/${userId}`, fetcher)

  if (error) return <div>Failed to load users</div>
  if (!user) return <Loading />

  return <Heading as="h1">{user.name}</Heading>
}
