import {
  Box,
  ColorModeProvider,
  CSSReset,
  ThemeProvider,
} from "@chakra-ui/core"
import dynamic from "next/dynamic"
import { AppProps } from "next/app"
import Head from "next/head"

import { Container } from "../components/Container"
import Footer from "../components/Footer"

import theme from "../theme"

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false })

const App = ({ Component }: AppProps) => {
  return (
    <>
      <Head>
        <title>Simonyi Könyvtár</title>
        <meta property="og:title" content="Simonyi Könvtár" key="title" />
        <meta lang="hu" />
      </Head>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Container>
            <Navbar />
            <Box flex="1" width="100%" px="1rem">
              <Component />
            </Box>
            <Footer />
          </Container>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  )
}

export default App
