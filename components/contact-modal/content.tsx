import React, { useEffect, useState } from 'react'

import { pushToAnalytics } from '../../lib/push-to-analytics'
import { getStore } from '../../lib/store'
import styles from './index.module.css'

type Props = {
  onClose: () => void
  openDetail?: {
    source?: string
    content_title?: string
    topic_key?: string
  } | null
}

export function LeadFormModalContent({ onClose, openDetail }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const store = getStore()
    const cleanTitle = openDetail?.content_title || store.cleanTitle
    const topicKey = openDetail?.topic_key || store.topicKey

    pushToAnalytics({
      event: 'lead_view',
      content_title: cleanTitle,
      topic_key: topicKey,
      from_page: window.location.pathname
    })
  }, [openDetail?.content_title, openDetail?.topic_key])

  const handleTelegramClick = () => {
    const store = getStore()
    const cleanTitle = openDetail?.content_title || store.cleanTitle
    const topicKey = openDetail?.topic_key || store.topicKey

    pushToAnalytics({
      event: 'lead_submit',
      source: 'telegram',
      content_title: cleanTitle,
      topic_key: topicKey,
      from_page: window.location.pathname
    })

    // можно закрывать модалку после клика, если хочешь
    // onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'email'
        })
      })

      const data = await res.json()

      if ((data as any).ok) {
        const store = getStore()
        const cleanTitle = openDetail?.content_title || store.cleanTitle
        const topicKey = openDetail?.topic_key || store.topicKey

        setSent(true)
        pushToAnalytics({
          event: 'lead_submit',
          source: 'form',
          content_title: cleanTitle,
          topic_key: topicKey,
          from_page: window.location.pathname
        })
      } else {
        // TODO: показать ошибку
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Ранний доступ к Sobesin</h2>

      <p className={styles.text}>
        Я постепенно открываю полные разборы и практику. Оставь контакт —
        напишу, когда откроется доступ.
      </p>

      <p className={styles.text}>
        <i>📬 Без спама — только уведомление о запуске.</i>
      </p>

      <a
        href='https://t.me/sobesin_bot?start=paywall'
        target='_blank'
        rel='noreferrer'
        className={styles.tgButton}
        onClick={handleTelegramClick}
      >
        🚀 Получить уведомление в Telegram
      </a>

      <div className={styles.divider}>или</div>

      {!sent ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type='email'
            required
            placeholder='Введите email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <button type='submit' className={styles.submit} disabled={submitting}>
            {submitting ? 'Отправляю...' : 'Получить письмо о запуске'}
          </button>
        </form>
      ) : (
        <>
          <p className={styles.success}>
            Спасибо! Я напишу, когда всё будет готово.
          </p>
          <button className={styles.secondary} onClick={onClose}>
            Закрыть
          </button>
        </>
      )}
    </div>
  )
}
