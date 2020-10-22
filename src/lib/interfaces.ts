import { Book, Category } from '@prisma/client'

export interface BookWithCategories extends Book {
  categories: Category[]
}

export interface BookWithCategoryIds extends Book {
  categories: { id: number }[]
}

export interface Cart {
  sumCount: number
  books: CartItem[]
}

export interface CartItem {
  id: number
  quantity: number
  title: string
  author: string
}
