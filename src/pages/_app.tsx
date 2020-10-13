import {
  Box,
  ColorModeProvider,
  CSSReset,
  ThemeProvider,
} from '@chakra-ui/core'
import { AppProps } from 'next/app'
import Head from 'next/head'

import { Container } from '../components/Container'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import theme from '../theme'

const App = ({ Component }: AppProps) => {
  return (
    <>
      <Head>
        <title>Simonyi Könyvtár</title>
        <meta property='og:title' content='Simonyi Könvtár' key='title' />
        <meta lang='hu' />
      </Head>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Container>
            <Navbar />
            <Box flex='1' maxWidth='84rem' width='100%' px='1rem'>
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
