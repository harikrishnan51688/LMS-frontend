import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: null,
    is_superuser: false,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
    resetState() {
      this.user = null
      this.email = null
      this.is_superuser = false
      localStorage.removeItem('user')
    },
    async login(email, password) {
      try {
        const response = await axios.get(`${API_URL}/api/login`, {
          auth: {
            username: email,
            password: password
          }
        })
        if (response.data.token) {
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(response.data))

          const token = response.data.token
          const payload = JSON.parse(atob(token.split('.')[1]))
          this.email = payload.email
          this.is_superuser = payload.is_superuser

          return response.data
        }
      } catch (error) {
        this.user = null
        this.email = null
        this.is_superuser = null
        localStorage.removeItem('user')
        throw error
      }
    },
    async checkAuth() {
      if (!this.user) {
        this.resetState()
        return
      }
      try {
        const response = await axios.get(`${API_URL}/api/check-auth`, {
          headers: { Authorization: `Bearer ${this.user.token}` }
        })
        if (response.data.authenticated) {
          this.email = response.data.email
          this.is_superuser = response.data.is_superuser
        } else {
          this.resetState()
        }
      } catch (error) {
        this.resetState()
      }
    },
    logout() {
      this.resetState()
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    isSuperUser: (state) => state.is_superuser
  }
})
