import Head from 'next/head'

import { Paywall } from '../components/paywall'

export default function PaywallPage() {
  return (
    <>
      <Head>
        <title>Sobesin Pro — полный доступ</title>
        <meta name='robots' content='noindex' />
      </Head>

      <Paywall />
    </>
  )
}
