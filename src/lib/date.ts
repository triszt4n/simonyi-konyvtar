import { formatDistance } from "date-fns"
import hu from "date-fns/locale/hu"

export function timeAgo(date: Date) {
  return formatDistance(date, new Date(), { locale: hu, addSuffix: true })
}
