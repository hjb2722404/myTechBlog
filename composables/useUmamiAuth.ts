import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const token = ref<string | null>(null)
const isAuthenticated = ref(false)

export const useUmamiAuth = () => {
  const config = useRuntimeConfig()

  const login = async () => {
    try {
      const response = await $fetch('/api/umami/auth/login', {
        method: 'POST',
        body: {
          username: config.public.umamiUsername,
          password: config.public.umamiPassword,
        },
      })

      token.value = response.token
      isAuthenticated.value = true

      return response.token
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const getToken = async () => {
    if (!token.value) {
      await login()
    }
    return token.value
  }

  const clearToken = () => {
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
