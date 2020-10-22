import useSWR from "swr"
import createPersistedState from "use-persisted-state"
import { Cart, CartItem } from "./interfaces"

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useUser() {
  const { data, mutate } = useSWR("/api/user", fetcher)
  // if data is not defined, the query has not completed
  const loading = !data
  const user = data?.user
  return [user, { mutate, loading }]
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
              it.id === book.id ? { ...it, quantity: it.quantity + 1 } : it
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
            it.id === book.id ? { ...it, quantity: it.quantity - 1 } : it
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
    deleteAll: () => {
      setCart({
        sumCount: 0,
        books: [],
      })
    },
  }
}
