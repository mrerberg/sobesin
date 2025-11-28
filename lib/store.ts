const STORE = { cleanTitle: '', topicKey: '', contentType: '' }

export const setToStore = (data: unknown) => {
  ;(window as any).data = data
}

export const getStore = () => {
  return (window as any).data || STORE
}
