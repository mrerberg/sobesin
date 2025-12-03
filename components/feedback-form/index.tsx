/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import cs from 'classnames'
import React, { type FormEvent, useEffect, useState } from 'react'

import { getStore } from '../../lib/store'
import styles from './index.module.css'

type FeedbackRequest = {
  title: string
  contentType: 'card' | 'topic'
  text: string
}

export function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = () => {
    setIsOpen(true)
    setSent(false)
    setError(null)
  }

  const close = () => {
    if (isSending) return
    setIsOpen(false)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!text.trim()) return

    const { cleanTitle, contentType } = getStore()

    setIsSending(true)
    setError(null)

    const payload: FeedbackRequest = {
      title: cleanTitle,
      contentType,
      text: text.trim()
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = (await res.json()) as { ok: boolean; error?: string }

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setSent(true)
      setText('')
    } catch (err) {
      console.error(err)
      setError('Не удалось отправить отзыв. Попробуйте ещё раз.')
    } finally {
      setIsSending(false)
    }
  }

  // Закрытие по Esc
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSending])

  return (
    <>
      <button type='button' className={styles.fab} onClick={open}>
        Отзыв
      </button>

      {isOpen && (
        <div className={styles.backdrop} onClick={close}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
          >
            <div className={styles.modalHeader}>
              <h3 className={cs(styles.modalTitle, 'notion-h-title')}>
                Форма обратной связи
              </h3>
              <button
                type='button'
                className={styles.closeButton}
                onClick={close}
              >
                ×
              </button>
            </div>

            <p className={cs(styles.context, 'notion-text')}>
              Сообщи о проблеме, баге или же предложи свои идеи по улучшению
              сервиса!
              <br />
              Будем очень благодарны за обратную связь :)
            </p>

            {sent ? (
              <div className={styles.sentBlock}>
                <p>Спасибо! Отзыв отправлен 🙌</p>
                <button
                  type='button'
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSent(false)
                    setError(null)
                  }}
                >
                  Отправить ещё один
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder='Опишите суть проблемы или предложения по улучшению.'
                  required
                />

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                  <button
                    type='button'
                    className={styles.secondaryButton}
                    onClick={close}
                    disabled={isSending}
                  >
                    Отмена
                  </button>
                  <button
                    type='submit'
                    className={styles.primaryButton}
                    disabled={isSending || !text.trim()}
                  >
                    {isSending ? 'Отправка…' : 'Отправить'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
