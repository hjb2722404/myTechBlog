import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const token = ref<string | null>(null)
const isAuthenticated = ref(false)

export const useUmamiAuth = () => {
  const config = useRuntimeConfig()

  const login = async () => {
    try {
      console.log('Attempting to login with username:', config.public.umamiUsername)
      
      const response = await $fetch('/api/umami/auth/login', {
        method: 'POST',
        body: {
          username: config.public.umamiUsername,
          password: config.public.umamiPassword,
        },
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
