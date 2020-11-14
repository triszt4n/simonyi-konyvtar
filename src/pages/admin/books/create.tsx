import { Heading } from "@chakra-ui/react"
import React from "react"

import { BookForm } from "components/books/BookForm"
import ErrorPage from "components/ErrorPage"
import { useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

const CreateBook = () => {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return (
      <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
    )
  }
  return (
    <>
      <Heading as="h2">Új könyv felvétele</Heading>
      <BookForm />
    </>
  )
}

export default CreateBook
