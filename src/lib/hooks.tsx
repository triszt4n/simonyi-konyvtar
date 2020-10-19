import useSWR from "swr"
import createPersistedState from "use-persisted-state"
import { CartItem } from "./interfaces"

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useUser() {
  const { data, mutate } = useSWR("/api/user", fetcher)
  // if data is not defined, the query has not completed
  const loading = !data
  const user = data?.user
  return [user, { mutate, loading }]
}

const useCartState = createPersistedState("cart")

export const useCart = (initialState = []) => {
  const [cart, setCart] = useCartState<CartItem[]>(initialState)

  return {
    cart,
    addBook: (book: CartItem) => {
      if (cart.length) {
        const cartBook = cart.find((it) => it.id === book.id)
        if (cartBook) {
          setCart(
            cart.map((it) =>
              it.id === book.id ? { ...it, quantity: it.quantity + 1 } : it
            )
          )
        } else {
          setCart([...cart, book])
        }
      } else {
        setCart([book])
      }
    },
    removeBook: (book: CartItem) => {
      if (!cart.length) return
      const cartBook = cart.find((it) => it.id === book.id)
      if (!cartBook) return
      if (cartBook.quantity > 1) {
        setCart(
          cart.map((it) =>
            it.id === book.id ? { ...it, quantity: it.quantity - 1 } : it
          )
        )
      }
    },
    deleteBook: (book: CartItem) => {
      const cartBook = cart.find((it) => it.id === book.id)
      if (!cartBook) return
      setCart(cart.filter((it) => it.id !== book.id))
    },
  }
}
