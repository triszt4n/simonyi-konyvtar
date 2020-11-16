import * as yup from "yup"

export const UserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

export const CategorySchema = yup.object().shape({
  name: yup.string().required(),
})

export const BookSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string(),
  count: yup.number(),
  stockCount: yup.number(),
  isbn: yup.string(),
  publisher: yup.string(),
  publishedAt: yup.number(),
  notes: yup.string(),
  image: yup.string(),
})
