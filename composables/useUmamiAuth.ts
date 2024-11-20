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
      
      const response = await $fetch('https://api-gateway.umami.dev/api/auth/login', {
        method: 'POST',
        body: {
          username: config.public.umamiUsername,
          password: config.public.umamiPassword,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
        status: error.status
      })

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
