import { Heading } from "@chakra-ui/react"
import { User } from "@prisma/client"
import { fetcher } from "lib/hooks"
import { useRouter } from "next/router"
import useSWR from "swr"

export default function UserPage() {
  const router = useRouter()
  const userId = router.query.id
  const { data: user, error } = useSWR<User>(`/api/users/${userId}`, fetcher)

  if (error) return <div>Failed to load users</div>
  if (!user) return <div>Loading...</div>

  return <Heading as="h1">{user.name}</Heading>
}
