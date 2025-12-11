export type ContentMeta = {
  contentType: 'topic' | 'card'
  cleanTitle: string
  topicKey: string | null
}

const TOPICS_LIST = new Set([
  'React',
  'Сеть',
  'Безопасность',
  'State managers',
  'JavaScript',
  'TypeScript',
  'Архитектура',
  'Тестирование',
  'Инженерные практики',
  'Troubleshooting',
  'Надежность, эксплуатация, наблюдаемость',
  'Тестовые задания'
])

export function parseContentMeta(rawTitle: string): ContentMeta {
  if (rawTitle === 'Sobesin — Frontend Developer') {
    return {
      contentType: 'topic',
      cleanTitle: 'Sobesin — Frontend Developer',
      topicKey: 'Sobesin — Frontend Developer'
    }
  }

  const topicMatch = TOPICS_LIST.has(rawTitle)

  console.log('is topic -->', topicMatch)

  if (!topicMatch) {
    return {
      contentType: 'card',
      cleanTitle: rawTitle.trim(),
      topicKey: null
    }
  }

  const cleanTitle = rawTitle.replace(/\[t-[^\]]+\]/, '').trim()

  return {
    contentType: 'topic',
    cleanTitle,
    topicKey: rawTitle
  }
}
