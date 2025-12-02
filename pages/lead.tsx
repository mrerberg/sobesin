// import { Layout } from 'components/layout'
import Head from 'next/head'

import { LeadForm } from '@/components/lead-form'

function LeadPage() {
  return (
    <>
      <Head>
        <title>Sobesin Pro — ранний доступ</title>
        <meta name='robots' content='noindex' />
      </Head>

      <LeadForm />
    </>
  )
}

export default LeadPage
