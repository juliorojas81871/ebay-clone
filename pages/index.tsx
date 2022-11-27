import type { NextPage } from 'next'
import Head from 'next/head'
import {Header, Coursel} from '../components'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ebay Clone</title>
        <link rel="icon" href="/ebay-icon.png" />
      </Head>

      <Header />
      <Coursel />

    </div>
  )
}

export default Home
