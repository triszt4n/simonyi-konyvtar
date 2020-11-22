import { Text, ChakraProps } from "@chakra-ui/react"
import { format } from "date-fns"
import hu from "date-fns/locale/hu"

interface HunDateProps {
  date: Date
  props?: ChakraProps
}

export function HunDate({ date, props }: HunDateProps) {
  return <Text {...props}>{format(date, "yyyy. MMMM dd.", { locale: hu })}</Text>
}
