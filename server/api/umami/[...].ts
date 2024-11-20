import { defineEventHandler, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const path = event.path?.replace('/api/umami/', '') || ''

  try {
    const response = await fetch(`https://cloud.umami.is/api/${path}${query ? '?' + new URLSearchParams(query as Record<string, string>).toString() : ''}`, {
      headers: {
        'Authorization': `Bearer ${config.public.umamiApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Umami API error:', error)
    throw error
  }
})
