import { ref } from 'vue'

const token = ref<string | null>(null)
const isAuthenticated = ref(false)

export const useUmamiAuth = () => {
  const login = async () => {
    try {
      const response = await fetch('https://analytics.umami.is/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: process.env.UMAMI_USERNAME,
          password: process.env.UMAMI_PASSWORD,
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      token.value = data.token
      isAuthenticated.value = true

      return data.token
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
