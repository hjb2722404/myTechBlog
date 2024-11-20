import { defineEventHandler, getRequestURL, sendProxy, getQuery, getMethod, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const method = getMethod(event)
  
  // 移除 /api 前缀
  const path = url.pathname.replace(/^\/api/, '')
  
  // 构建目标 URL
  const target = `https://analytics.umami.is${path}`
  
  // 获取查询参数
  const query = getQuery(event)
  
  // 获取请求体（如果是 POST/PUT 请求）
  let body = null
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event)
  }

  // 设置请求选项
  const options = {
    method,
    headers: {
      ...event.node.req.headers,
      'host': 'analytics.umami.is',
      'origin': 'https://analytics.umami.is',
      'referer': 'https://analytics.umami.is/'
    },
    body: body ? JSON.stringify(body) : undefined,
    query
  }

  // 添加 CORS 头
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理预检请求
  if (method === 'OPTIONS') {
    event.node.res.statusCode = 204
    return null
  }

  try {
    // 发送代理请求
    const response = await $fetch.raw(target, options)
    
    // 复制响应头
    for (const [key, value] of Object.entries(response.headers)) {
      if (key.toLowerCase() !== 'content-encoding') { // 跳过内容编码头
        event.node.res.setHeader(key, value)
      }
    }

    return response._data
  } catch (error) {
    console.error('Proxy error:', error)
    throw error
  }
})
