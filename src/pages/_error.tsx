import getConfig from "next/config"
const { serverRuntimeConfig } = getConfig()
function Error({ statusCode }: { statusCode: number }) {
  return (
    <p>
      {statusCode
        ? `Error ${statusCode} hiba történt a szerveren`
        : "Kliensoldali hiba történt"}
    </p>
  )
}
Error.getInitialProps = ({ req, res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  // Only require Rollbar and report error if we're on the server
  if (!process.browser) {
    console.log("Reporting error to Rollbar...")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Rollbar = require("rollbar")
    const rollbar = new Rollbar(serverRuntimeConfig.rollbarServerToken)
    rollbar.error(err, req, (rollbarError) => {
      if (rollbarError) {
        console.error("Rollbar error reporting failed:")
        console.error(rollbarError)
        return
      }
      console.log("Reported error to Rollbar")
    })
  }
  return { statusCode }
}
export default Error
