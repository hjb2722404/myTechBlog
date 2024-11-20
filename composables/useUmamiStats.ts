import { useUmamiAuth } from './useUmamiAuth'

interface UmamiStats {
  pageviews: {
    value: number
    change: number
  }
  uniques: {
    value: number
    change: number
  }
  bounces: {
    value: number
    change: number
  }
  totaltime: {
    value: number
    change: number
  }
}

interface PageViewResponse {
  x: string // timestamp
  y: number // count
}

export const useUmamiStats = () => {
  const config = useRuntimeConfig()
  const { getToken } = useUmamiAuth()
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const fetchStats = async (path: string) => {
    try {
      const token = await getToken()
      
      const response = await fetch(`https://analytics.umami.is/api${path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stats fetch error:', error)
      throw error
    }
  }

  // 获取文章页面访问量
  const getPageViews = async (path: string, startAt?: Date, endAt?: Date) => {
    try {
      isLoading.value = true
      const websiteId = config.public.umamiWebsiteId
      const start = startAt?.getTime() || Date.now() - 30 * 24 * 60 * 60 * 1000 // 默认30天
      const end = endAt?.getTime() || Date.now()

      const data = await fetchStats(`/websites/${websiteId}/pageviews?startAt=${start}&endAt=${end}&url=${path}`)

      return (data as PageViewResponse[]).reduce((sum, item) => sum + item.y, 0)
    } catch (e) {
      error.value = e as Error
      console.error('Error getting page views:', e)
      return 0
    } finally {
      isLoading.value = false
    }
  }

  // 获取热门文章
  const getPopularArticles = async (limit = 5, startAt?: Date, endAt?: Date) => {
    try {
      isLoading.value = true
      const websiteId = config.public.umamiWebsiteId
      const start = startAt?.getTime() || Date.now() - 30 * 24 * 60 * 60 * 1000
      const end = endAt?.getTime() || Date.now()

      const data = await fetchStats(`/websites/${websiteId}/metrics?startAt=${start}&endAt=${end}&type=url`)

      return (data as any[])
        .filter(item => item.url.startsWith('/articles/'))
        .sort((a, b) => b.pageviews - a.pageviews)
        .slice(0, limit)
    } catch (e) {
      error.value = e as Error
      console.error('Error getting popular articles:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getPageViews,
    getPopularArticles,
  }
}
