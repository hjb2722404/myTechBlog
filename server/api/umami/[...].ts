import { defineEventHandler, getRequestURL, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 获取请求路径
    const url = getRequestURL(event)
    const path = url.pathname.replace(/^\/api\/umami/, '')
    
    console.log('Proxying request to:', path)
    
    // 构建目标 URL
    const target = `https://analytics.umami.is/api${path}`
    
    // 获取请求体（如果有）
    let body = null
    if (['POST', 'PUT', 'PATCH'].includes(event.method)) {
      body = await readBody(event)
      console.log('Request body:', JSON.stringify(body))
    }

    // 获取所有原始请求头
    const headers = event.headers
    console.log('Original request headers:', Object.fromEntries(headers.entries()))

    // 构建请求配置
    const requestConfig = {
      method: event.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Nuxt/Proxy',
        'Origin': 'https://analytics.umami.is',
        'Referer': 'https://analytics.umami.is/',
        ...(headers.get('authorization') ? {
          'Authorization': headers.get('authorization')
        } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    }

    console.log('Request config:', {
      method: requestConfig.method,
      headers: requestConfig.headers,
      target
    })

    // 发送请求到 Umami API
    const response = await fetch(target, requestConfig)
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    // 如果响应不成功，记录详细信息并抛出错误
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Umami API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        message: `Umami API error: ${errorText}`
      })
    }

    // 返回响应数据
    const data = await response.json()
    console.log('Successfully proxied request')
    return data
  } catch (error) {
    console.error('Umami API proxy error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'An error occurred while proxying the request'
    })
  }
})
