import { userrole } from "@prisma/client"
import { useUser } from "lib/hooks"

export default function HasRole({ roles, children }) {
  const [user] = useUser()

  return <>{roles.some((it) => it === user?.role) ? children : null}</>
}
