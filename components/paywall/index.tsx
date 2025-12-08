import { pushToAnalytics } from 'lib/push-to-analytics'
import Link from 'next/link'
import { useEffect } from 'react'
import BodyClassName from 'react-body-classname'

import { getStore } from '../../lib/store'
import { BackButton } from '../back-button'
import styles from './index.module.css'

export function Paywall() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as any
    const { cleanTitle, topicKey } = getStore()

    pushToAnalytics({
      event: 'paywall_view',
      content_title: cleanTitle,
      topic_key: topicKey,
      from_page: w.location.pathname
    })
  }, [])

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleOpenLead = () => {
    if (typeof window === 'undefined') return

    const { cleanTitle, topicKey } = getStore()

    pushToAnalytics({
      event: 'paywall_click_cta_buy',
      content_title: cleanTitle,
      topic_key: topicKey || '',
      from_page: window.location.pathname
    })
  }

  return (
    <div className={styles.wrapper}>
      <BodyClassName className='dark-mode' />
      <div className={styles.card}>
        <BackButton />

        <div className={styles.header}>
          <div className={styles.badge}>План «Pro»</div>
          <h1 className={styles.title}>Полный доступ к Sobesin Pro</h1>
        </div>

        <div className={styles.priceBox}>
          <span className={styles.priceValue}>4&nbsp;999&nbsp;₽</span>
          <span className={styles.priceLabel}>единоразовый платеж</span>
        </div>

        <p className={styles.subtitle}>
          Доступ ко всем темам и карточкам навсегда — без подписки.
        </p>

        <ul className={styles.list}>
          <li>🔥 Все темы и карточки без ограничений</li>
          <li>🧾 Готовые ответы, примеры и анти-примеры</li>
          <li>🧠 Практика и встречные вопросы</li>
          <li>🚩 Фейлы и красные флаги для интервьюеров</li>
        </ul>

        <Link href='/lead' className={styles.submit} onClick={handleOpenLead}>
          Получить ранний доступ
        </Link>
      </div>
    </div>
  )
}
