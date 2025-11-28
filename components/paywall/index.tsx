import { useEffect, useState } from 'react'

import { pushToAnalytics } from '../../lib/push-to-analytics'
import { getStore } from '../../lib/store'
import styles from './index.module.css'

export function Paywall() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const w = window as any
    const { cleanTitle, topicKey } = w.data || { cleanTitle: '', topicKey: '' }

    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'paywall_view',
      content_title: cleanTitle,
      topic_key: topicKey,
      from_page: document.referrer || window.location.pathname
    })
  }, [])

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleTelegramClick = () => {
    const { cleanTitle, topicKey } = getStore()

    pushToAnalytics({
      event: 'lead_submit',
      source: 'telegram',
      content_title: cleanTitle,
      topic_key: topicKey,
      from_page: window.location.pathname
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setSubmitting(true)
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'paywall_email'
      })
    })

    const data = await res.json()

    if ((data as any).ok) {
      const { cleanTitle, topicKey } = getStore()

      setSent(true)
      pushToAnalytics({
        event: 'lead_submit',
        source: 'form',
        content_title: cleanTitle,
        topic_key: topicKey,
        from_page: window.location.pathname
      })
    } else {
      // показать ошибку
    }

    setSubmitting(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* <h1 className={styles.title}>🔒 Доступ к Pro-версии</h1> */}

        <h1 className={styles.title}>Ранний доступ к Sobesin Pro</h1>

        <p className={styles.text}>
          <b>Спасибо за интерес! 🙌</b>
        </p>

        <p className={styles.text}>
          Сейчас база находится в разработке. Укажите почту ниже — я напишу,
          когда откроется доступ (и пришлю промо-цену для ранних участников 💌).
        </p>

        <p className={styles.text}>
          <i>📬 Не рассылаю спам, только одно письмо о запуске.</i>
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
              placeholder='Введите email для уведомления о запуске'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <button
              type='submit'
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? 'Отправляю...' : 'Получить письмо о запуске'}
            </button>
          </form>
        ) : (
          <p className={styles.success}>
            Спасибо! Я напишу, когда Sobesin будет готов к запуску. Никакого
            спама — максимум пару писем о релизе и бонусах.
          </p>
        )}
      </div>
    </div>
  )
}
