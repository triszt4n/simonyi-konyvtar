import { Book, Category } from '@prisma/client'

export interface BookWithCategories extends Book {
  categories: Category[]
}
