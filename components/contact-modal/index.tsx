/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react'
import BodyClassName from 'react-body-classname'

import { LeadFormModalContent } from './content'
import styles from './index.module.css'

type OpenDetail = {
  source?: string
  content_title?: string
  topic_key?: string
}

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState<OpenDetail | null>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenDetail>).detail || null
      setOpenDetail(detail)
      setIsOpen(true)
    }

    window.addEventListener('sobesin:openContactModal', onOpen)
    return () => window.removeEventListener('sobesin:openContactModal', onOpen)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Если у тебя темная тема через класс — оставляем */}
      <BodyClassName className='dark-mode' />

      <div className={styles.backdrop} onMouseDown={() => setIsOpen(false)}>
        <div
          className={styles.modal}
          onMouseDown={(e) => e.stopPropagation()}
          role='dialog'
          aria-modal='true'
        >
          <button
            className={styles.close}
            onClick={() => setIsOpen(false)}
            aria-label='Закрыть'
          >
            ×
          </button>

          <LeadFormModalContent
            onClose={() => setIsOpen(false)}
            openDetail={openDetail}
          />
        </div>
      </div>
    </>
  )
}
