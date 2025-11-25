export type ContentMeta = {
  contentType: 'topic' | 'card'
  cleanTitle: string
  topicKey: string | null
}

export function parseContentMeta(rawTitle: string): ContentMeta {
  if (rawTitle === 'Sobesin — Frontend Developer') {
    return {
      contentType: 'topic',
      cleanTitle: 'Sobesin — Frontend Developer',
      topicKey: 'Sobesin — Frontend Developer'
    }
  }

  const match = rawTitle.match(/\[t-([^\]]+)\]/)

  if (!match) {
    return {
      contentType: 'card',
      cleanTitle: rawTitle.trim(),
      topicKey: null
    }
  }

  const topicKey = match[1]?.trim() || ''
  const cleanTitle = rawTitle.replace(/\[t-[^\]]+\]/, '').trim()

  return {
    contentType: 'topic',
    cleanTitle,
    topicKey
  }
}
