export const pushToAnalytics = (args: any) => {
  ;(window as any).dataLayer = (window as any).dataLayer || []

  const dl = (window as any).dataLayer

  dl?.push(args)
}
