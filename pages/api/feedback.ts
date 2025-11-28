// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_FEEDBACK_DB_ID as string

type FeedbackBody = {
  title?: string
  contentType?: 'card' | 'topic' | string
  text?: string
}

type ApiResponse = { ok: true } | { ok: false; error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { title, contentType, text } = req.body as FeedbackBody

  if (!title || !contentType || !text) {
    return res
      .status(400)
      .json({ ok: false, error: 'Нужно указать title, contentType и text' })
  }

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Title — колонка типа Title
        Title: {
          title: [
            {
              text: { content: title }
            }
          ]
        },

        // ContentType — колонка типа Rich text или Select
        ContentType: {
          rich_text: [
            {
              text: { content: contentType }
            }
          ]
        },

        // Text — колонка типа Rich text
        Text: {
          rich_text: [
            {
              text: { content: text }
            }
          ]
        },

        // необязательное поле, если заведёшь в базе колонку CreatedAt (Date)
        CreatedAt: {
          date: { start: new Date().toISOString() }
        }
      }
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Notion feedback error', err)
    return res.status(500).json({
      ok: false,
      error: 'Не удалось сохранить отзыв, попробуйте позже'
    })
  }
}
