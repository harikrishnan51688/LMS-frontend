import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
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
        }
        return response.data
      } catch (error) {
        this.user = null
        throw error
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user
  }
})
