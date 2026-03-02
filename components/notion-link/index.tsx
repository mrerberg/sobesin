import Link from 'next/link'
import React from 'react'

import { pushToAnalytics } from '../../lib/push-to-analytics'

function getBaseOrigin() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (envUrl) {
    try {
      return new URL(envUrl).origin
    } catch {
      return null
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return null
}

export function NotionLink(props: any) {
  const href: string = props.href || ''

  const isInternal = (() => {
    if (href.startsWith('/')) return true
    if (href.startsWith('#')) return true

    const baseOrigin = getBaseOrigin()
    if (!baseOrigin) return false

    try {
      const linkUrl = new URL(href)
      return linkUrl.origin === baseOrigin
    } catch {
      return false
    }
  })()

  console.log('isInternal -->', href, isInternal)

  if (isInternal) {
    const cleanHref = href.startsWith('http') ? new URL(href).pathname : href

    const handleClick = (evt: any) => {
      const { cleanTitle, topicKey } = (window as any).data || {
        cleanTitle: '',
        topicKey: ''
      }

      if (href.includes('/contact')) {
        evt.preventDefault()

        pushToAnalytics({
          event: 'click_cta_contact',
          content_title: cleanTitle,
          topic_key: topicKey,
          from_page: window.location.pathname
        })

        window.dispatchEvent(
          new CustomEvent('sobesin:openContactModal', {
            detail: {
              source: 'contact_link',
              content_title: cleanTitle,
              topic_key: topicKey
            }
          })
        )

        return
      }

      if (href.includes('/paywall')) {
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
