import Link from 'next/link'
import React from 'react'

import { pushToAnalytics } from '../../lib/push-to-analytics'

export function NotionLink(props: any) {
  const href: string = props.href || ''

  const isInternal =
    href.startsWith('/') ||
    href.startsWith(process.env.NEXT_PUBLIC_SITE_URL || '')

  console.log('isInternal -->', href, isInternal)

  if (isInternal) {
    const cleanHref = href.startsWith('http') ? new URL(href).pathname : href

    const handleClick = () => {
      if (href.includes('/paywall')) {
        const { cleanTitle, topicKey } = (window as any).data || {
          cleanTitle: '',
          topicKey: ''
        }

        if (cleanTitle === 'Sobesin') {
          pushToAnalytics({
            event: 'click_cta_buy',
            content_title: 'Главная',
            topic_key: '',
            from_page: window.location.pathname
          })
        }

        pushToAnalytics({
          event: 'click_cta_buy',
          content_title: cleanTitle,
          topic_key: topicKey,
          from_page: window.location.pathname
        })
      }
    }

    return (
      <Link
        {...props}
        href={cleanHref}
        target={undefined}
        rel={undefined}
        onClick={handleClick}
      ></Link>
    )
  }

  return <a {...props} />
}
