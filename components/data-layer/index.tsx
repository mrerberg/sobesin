import { useEffect } from 'react'

import { parseContentMeta } from '@/lib/content-meta'

import { pushToAnalytics } from '../../lib/push-to-analytics'
import { setToStore } from '../../lib/store'

type Props = { title: string }

export function DataLayer({ title }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const { contentType, cleanTitle, topicKey } = parseContentMeta(title)

    setToStore({ contentType, cleanTitle, topicKey })

    if (cleanTitle !== 'Sobesin') {
      pushToAnalytics({
        event: 'content_view',
        content_type: contentType,
        content_title: cleanTitle,
        topic_key: topicKey
      })
    }
  }, [title])

  return <></>
}
