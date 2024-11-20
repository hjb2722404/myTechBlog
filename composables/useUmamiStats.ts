import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

export const useUmamiStats = () => {
  const config = useRuntimeConfig()
  const BASE_URL = 'https://cloud.umami.is/api'

  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const getPageViews = async (path: string) => {
    try {
      isLoading.value = true
      const response = await $fetch(`${BASE_URL}/websites/${config.public.umamiWebsiteId}/pageviews`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.public.umamiApiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          url: path,
          startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime(), // 最近30天
          endAt: Date.now()
        }
      })
      return response.pageviews || 0
    } catch (error) {
      console.error('Failed to fetch page views:', error)
      error.value = error as Error
      return 0
    } finally {
      isLoading.value = false
    }
  }

  const getPopularPages = async (limit = 5) => {
    try {
      isLoading.value = true
      const response = await $fetch(`${BASE_URL}/websites/${config.public.umamiWebsiteId}/pages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.public.umamiApiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime(), // 最近30天
          endAt: Date.now(),
          limit
        }
      })
      return response.pages || []
    } catch (error) {
      console.error('Failed to fetch popular pages:', error)
      error.value = error as Error
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
