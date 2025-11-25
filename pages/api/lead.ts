import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_DB_ID as string

type LeadBody = {
  email?: string
  telegram?: string
  source?: string
}

type ApiResponse = { ok: true } | { ok: false; error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { email, telegram, source } = req.body as LeadBody

  if (!email && !telegram) {
    return res
      .status(400)
      .json({ ok: false, error: 'Нужно указать email или Telegram' })
  }

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Названия свойств должны совпадать с колонками в твоей Notion-базе
        Name: {
          title: [
            {
              text: {
                content: email || telegram || 'Лид без контакта'
              }
            }
          ]
        },
        Source: source
          ? {
              rich_text: [
                {
                  text: { content: source }
                }
              ]
            }
          : undefined,
        CreatedAt: {
          date: { start: new Date().toISOString() }
        }
      }
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Notion lead error', err)
    return res.status(500).json({
      ok: false,
      error: 'Не удалось сохранить заявку, попробуйте позже'
    })
  }
}
