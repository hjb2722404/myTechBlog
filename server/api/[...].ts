import { defineEventHandler, getRequestURL, sendProxy } from 'h3'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // 移除 /api 前缀
  const path = url.pathname.replace(/^\/api/, '')
  
  // 构建目标 URL
  const target = `https://analytics.umami.is${path}`
  
  // 转发请求
  return sendProxy(event, target, {
    headers: {
      // 保留原始请求头
      ...event.node.req.headers,
      // 确保主机头是正确的
      host: 'analytics.umami.is',
    },
  })
})
