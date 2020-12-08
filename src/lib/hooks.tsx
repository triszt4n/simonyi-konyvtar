import { User as DbUser } from "@prisma/client"
import useSWR from "swr"
import createPersistedState from "use-persisted-state"

import { Cart, CartItem } from "lib/interfaces"
import { userrole } from "./prismaClient"

type User = Omit<DbUser, "password">

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error("An error occurred while fetching the data.")
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

export function useUser() {
  const { data, mutate } = useSWR<{ user: User }>("/api/user", fetcher)
  const loading = !data
  const user = data?.user
  return [user, { mutate, loading }] as const
}

export function useRequireRoles(roles: userrole[] = []) {
  const [user] = useUser()

  return roles.some((it) => it === user?.role)
}

const useCartState = createPersistedState("cart")

export const useCart = (initialState: Cart = { sumCount: 0, books: [] }) => {
  const [cart, setCart] = useCartState<Cart>(initialState)

  return {
    cart: cart,
    addBook: (book: CartItem) => {
      if (cart.books.length) {
        const cartBook = cart.books.find((it) => it.id === book.id)
        if (cartBook) {
          setCart({
            sumCount: cart.sumCount + 1,
            books: cart.books.map((it) =>
              it.id === book.id ? { ...it, quantity: it.quantity + 1 } : it,
            ),
          })
        } else {
          setCart({ sumCount: cart.sumCount + 1, books: [...cart.books, book] })
        }
      } else {
        setCart({ sumCount: 1, books: [book] })
      }
    },
    removeBook: (book: CartItem) => {
      if (!cart.books.length) return
      const cartBook = cart.books.find((it) => it.id === book.id)
      if (!cartBook) return
      if (cartBook.quantity > 1) {
        setCart({
          sumCount: cart.sumCount - 1,
          books: cart.books.map((it) =>
            it.id === book.id ? { ...it, quantity: it.quantity - 1 } : it,
          ),
        })
      }
    },
    deleteBook: (book: CartItem) => {
      const cartBook = cart.books.find((it) => it.id === book.id)
      if (!cartBook) return
      setCart({
        sumCount: cart.sumCount - cartBook.quantity,
        books: cart.books.filter((it) => it.id !== book.id),
      })
    },
    emptyCart: () => {
      setCart({
        sumCount: 0,
        books: [],
      })
    },
  }
}
