import { defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  
  // 如果是 API 请求，添加必要的 CORS 和代理头
  if (url.pathname.startsWith('/api/')) {
    event.node.res.setHeader('Access-Control-Allow-Origin', '*')
    event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // 处理预检请求
    if (event.node.req.method === 'OPTIONS') {
      event.node.res.statusCode = 204
      event.node.res.end()
      return
    }
  }
})
