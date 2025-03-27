import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  refreshToken: string | null
  user: {
    name: string | null
  }
}

interface Credentials {
  username: string
  password: string
}

// Constants for API endpoints
const LOGIN_URL = '/auth'
const REFRESH_TOKEN_URL = '/auth'

// Basic auth headers for OAuth-style authentication
const AUTH_BASIC_HEADERS = {
  headers: {
    'Authorization': 'Basic ZGVtb2FwcDpkZW1vcGFzcw==' // Base64(client_id:client_secret) "demoapp:demopass"
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    user: {
      name: null
    }
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return this.isLoggedIn && !!this.accessToken
    },
    userName(): string | null {
      return this.user.name
    }
  },
  
  actions: {
    async login(credentials: Credentials, redirect?: string) {
      try {
        const params = {
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password
        }
        
        const response = await axios.post(LOGIN_URL, params, AUTH_BASIC_HEADERS)
        this.storeTokens(response.data)
        
        if (redirect) {
          router.push({ name: redirect })
        }
        
        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.error_description || 'An error occurred during login'
        }
      }
    },
    
    logout() {
      this.$reset()
      router.push({ name: 'login' })
    },
    
    storeTokens(authData: any) {
      this.isLoggedIn = true
      this.accessToken = authData.access_token
      this.refreshToken = authData.refresh_token
      // TODO: get user's name from response from OAuth server, for now hardcoded like in original
      this.user.name = 'John Smith'
    },
    
    async refreshToken() {
      try {
        const params = {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }
        
        const response = await axios.post(REFRESH_TOKEN_URL, params, AUTH_BASIC_HEADERS)
        this.storeTokens(response.data)
        return true
      } catch (error) {
        this.logout()
        return false
      }
    }
  }
})