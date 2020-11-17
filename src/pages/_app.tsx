import { Box, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Head from "next/head"

import { Container } from "components/Container"
import Footer from "components/Footer"

const Navbar = dynamic(() => import("components/Navbar"), { ssr: false })

const App = ({ Component }: AppProps) => {
  return (
    <>
      <Head>
        <title>Simonyi Könyvtár</title>
        <meta property="og:title" content="Simonyi Könvtár" key="title" />
        <meta lang="hu" />
      </Head>
      <ChakraProvider>
        <Container>
          <Navbar />
          <Box flex="1" width="100%" px={5}>
            <Component />
          </Box>
          <Footer />
        </Container>
      </ChakraProvider>
    </>
  )
}

export default App
