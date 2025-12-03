import ExpiryMap from 'expiry-map'
import pMemoize from 'p-memoize'

import type * as types from './types'
import { api } from './config'
import { pushToAnalytics } from './push-to-analytics'

export const searchNotion = pMemoize(searchNotionImpl, {
  cacheKey: (args) => args[0]?.query,
  cache: new ExpiryMap(10_000)
})

async function searchNotionImpl(
  params: types.SearchParams
): Promise<types.SearchResults> {
  return fetch(api.searchNotion, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      ancestorId: '29ae3422cca480f08519fb095df2892a'
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then((res) => {
      if (res.ok) {
        return res
      }

      // convert non-2xx HTTP responses into errors
      const error: any = new Error(res.statusText)
      error.response = res
      throw error
    })
    .then((res) => res.json() as Promise<types.SearchResults>)
    .then((results) => {
      if (typeof window !== 'undefined') {
        const resultsArray = (results as any).results
        const resultsCount = Array.isArray(resultsArray)
          ? resultsArray.length
          : 0

        pushToAnalytics({
          event: 'view_search_results',
          search_query: (params as any).query ?? '',
          results_count: resultsCount,
          from_page: window.location.pathname
        })
      }

      return results
    })

  // return ky
  //   .post(api.searchNotion, {
  //     json: params
  //   })
  //   .json()
}
