import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const path = event.path?.replace('/api/umami/', '') || ''

  // 记录请求信息
  console.log('Umami API Request:', {
    path,
    query,
    fullPath: `https://cloud.umami.is/api/${path}`
  })

  try {
    // 构建完整的 URL，包括查询参数
    const url = new URL(`https://cloud.umami.is/api/${path}`)
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    console.log('Full URL:', url.toString())

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.umamiApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Umami API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        message: `Umami API error: ${errorText}`
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Umami API Error:', {
      error,
      message: error.message,
      stack: error.stack
    })

    if (error.statusCode) {
      throw error // 如果是已经格式化的错误，直接抛出
    }

    // 创建格式化的错误响应
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Failed to fetch from Umami API: ${error.message}`
    })
  }
})
