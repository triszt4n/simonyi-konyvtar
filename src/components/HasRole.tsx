import { useUser } from "lib/hooks"
import { userrole } from "lib/prismaClient"

interface Props {
  roles: userrole[]
  children: JSX.Element
}

export default function HasRole({ roles, children }: Props) {
  const [user] = useUser()
  const hasRole = roles.some((it) => it === user?.role)

  return <>{hasRole && children}</>
}
