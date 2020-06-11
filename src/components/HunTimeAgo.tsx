import TA, { ReactTimeagoProps } from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import hunStrings from 'react-timeago/lib/language-strings/hu'

const formatter = buildFormatter(hunStrings)

const TimeAgo = (props: ReactTimeagoProps<React.FC>) => (
  <TA {...props} formatter={formatter} />
)

export default TimeAgo
