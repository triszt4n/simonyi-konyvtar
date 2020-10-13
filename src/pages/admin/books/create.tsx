import { BookFormType } from '../../../lib/interfaces'
import BookForm from '../../../components/books/BookForm'

const CreateBook = () => {
  const createBook = async () => {
    await fetch('/api/books', { method: 'POST' })
  }

  const initialValues: BookFormType = {
    author: '',
    comment: '',
    count: 0,
    image: '',
    isbn: '',
    publishedAt: null,
    publisher: '',
    stock: 0,
    title: '',
    categories: [],
  }
  return (
    <>
      <BookForm initialValues={initialValues} onSubmit={createBook} />
    </>
  )
}

export default CreateBook
