import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tag,
  TagLabel,
  Textarea,
  useToast,
} from "@chakra-ui/core"
import { Category } from "@prisma/client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useSWR from "swr"
import { fetcher } from "lib/hooks"
import { BookForm } from "components/BookForm"

const CreateBook = () => {
  return (
    <>
      <Heading as="h2">Új könyv felvétele</Heading>
      <BookForm />
    </>
  )
}

export default CreateBook
