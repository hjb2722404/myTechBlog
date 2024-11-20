import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

export const useUmamiStats = () => {
  const config = useRuntimeConfig()
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const fetchWithRetry = async <T>(
    url: string,
    params: Record<string, any>,
    retries = 3
  ): Promise<T> => {
    let lastError: any
    for (let i = 0; i < retries; i++) {
      try {
        const response = await $fetch<T>(url, {
          params,
          retry: i > 0 ? 1 : 0,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.public.umamiToken}`
          },
          onRequest({ options }) {
            console.log(`Attempting request to ${url}`, { 
              attempt: i + 1, 
              params,
              headers: options.headers 
            })
          },
          onRequestError({ error }) {
            console.error(`Request error (attempt ${i + 1}):`, error)
            lastError = error
          },
          onResponse({ response }) {
            console.log(`Response received (attempt ${i + 1}):`, {
              status: response.status,
              ok: response._data !== undefined,
              headers: response.headers
            })
          },
          onResponseError({ response }) {
            console.error(`Response error (attempt ${i + 1}):`, {
              status: response.status,
              data: response._data,
              headers: response.headers
            })
            lastError = new Error(response._data?.message || 'Unknown error')
          }
        })
        return response
      } catch (err) {
        lastError = err
        if (i === retries - 1) throw err
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw lastError
  }

  const getPageViews = async (path: string) => {
    try {
      isLoading.value = true
      const response = await fetchWithRetry<{ pageviews: number }>(
        `${config.public.umamiApiUrl}/websites/${config.public.umamiWebsiteId}/pageviews`,
        {
          url: path,
          startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime(),
          endAt: Date.now()
        }
      )
      return response.pageviews || 0
    } catch (err) {
      console.error('Failed to fetch page views:', err)
      error.value = err as Error
      return 0
    } finally {
      isLoading.value = false
    }
  }

  const getPopularPages = async (limit = 5) => {
    try {
      isLoading.value = true
      const response = await fetchWithRetry<{ pages: any[] }>(
        `${config.public.umamiApiUrl}/websites/${config.public.umamiWebsiteId}/pages`,
        {
          startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime(),
          endAt: Date.now(),
          limit
        }
      )
      return response.pages || []
    } catch (err) {
      console.error('Failed to fetch popular pages:', err)
      error.value = err as Error
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getPageViews,
    getPopularPages
  }
}
