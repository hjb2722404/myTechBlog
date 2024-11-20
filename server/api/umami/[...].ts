import { defineEventHandler, getRequestURL, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  // 获取请求路径
  const url = getRequestURL(event)
  const path = url.pathname.replace(/^\/api\/umami/, '')
  
  // 构建目标 URL
  const target = `https://analytics.umami.is/api${path}`
  
  // 获取请求体（如果有）
  let body = null
  if (['POST', 'PUT', 'PATCH'].includes(event.method)) {
    body = await readBody(event)
  }

  try {
    // 发送请求到 Umami API
    const response = await fetch(target, {
      method: event.method,
      headers: {
        'Content-Type': 'application/json',
        ...(event.headers.get('authorization') ? {
          'Authorization': event.headers.get('authorization')
        } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    })

    // 如果响应不成功，抛出错误
    if (!response.ok) {
      throw new Error(`Umami API error: ${response.statusText}`)
    }

    // 返回响应数据
    return await response.json()
  } catch (error) {
    console.error('Umami API proxy error:', error)
    throw error
  }
})
