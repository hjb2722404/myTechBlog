import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const token = ref<string | null>(null)
const isAuthenticated = ref(false)

export const useUmamiAuth = () => {
  const config = useRuntimeConfig()

  const login = async (retryCount = 0) => {
    try {
      console.log('Attempting to login with username:', config.public.umamiUsername)
      
      // 打印请求体以便调试
      const requestBody = {
        username: config.public.umamiUsername,
        password: config.public.umamiPassword,
        websiteId: config.public.umamiWebsiteId, // 添加 website ID
      }
      console.log('Request body:', JSON.stringify(requestBody))

      const response = await $fetch('https://api-gateway.umami.dev/2f9ef5d9-1a56-4ecf-9d5c-0f2bfee34530/api/auth/login', {
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Origin': 'https://my-tech-blog-orcin.vercel.app',
          'Referer': 'https://my-tech-blog-orcin.vercel.app/'
        },
        onRequest({ request, options }) {
          console.log('Request options:', {
            method: options.method,
            headers: options.headers,
            body: options.body
          })
        },
        onRequestError({ request, error }) {
          console.error('Request error:', error)
        },
        onResponse({ request, response, options }) {
          console.log('Response:', {
            status: response.status,
            headers: response._headers,
            body: response._data
          })
        },
        onResponseError({ request, response, options }) {
          console.error('Response error:', {
            status: response?.status,
            statusText: response?.statusText,
            data: response?._data
          })
        }
      })

      console.log('Login successful, received token')
      token.value = response.token
      isAuthenticated.value = true

      return response.token
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        data: error.data,
        status: error.status,
        response: error.response
      })

      // 如果是 400 错误，可能是请求格式问题
      if (error.status === 400) {
        console.error('Bad request error. Please check request format and credentials.')
      }

      // 如果是 403 错误并且还有重试次数，等待后重试
      if (error.status === 403 && retryCount < 3) {
        console.log(`Retrying login attempt ${retryCount + 1}/3...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return login(retryCount + 1)
      }

      throw error
    }
  }

  const getToken = async () => {
    if (!token.value) {
      console.log('No token found, attempting to login')
      await login()
    }
    return token.value
  }

  const clearToken = () => {
    console.log('Clearing authentication token')
    token.value = null
    isAuthenticated.value = false
  }

  return {
    login,
    getToken,
    clearToken,
    isAuthenticated,
  }
}
