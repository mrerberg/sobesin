import { posthog } from 'posthog-js'

type Args = {
  event: string
} & Record<string, unknown>

export const pushToAnalytics = (args: Args) => {
  ;(window as any).dataLayer = (window as any).dataLayer || []

  const dl = (window as any).dataLayer

  dl?.push(args)
  posthog.capture(args.event, args)
}
