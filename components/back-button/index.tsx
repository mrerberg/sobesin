'use client'

import { useRouter } from 'next/navigation'

import styles from './index.module.css'

export function BackButton({ fallback = '/' }) {
  const router = useRouter()

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button className={styles.back} onClick={goBack}>
      ← Назад
    </button>
  )
}
