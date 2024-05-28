<!-- <script setup>
import { RouterLink, RouterView } from 'vue-router'
</script> -->

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Library</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link mx-2 active" aria-current="page"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/ebooks" class="nav-link mx-2">Ebooks</router-link>
            </li>
            <li v-if="isLoggedIn && !isSuperUser" class="nav-item">
              <router-link to="/profile" class="nav-link mx-2">Profile</router-link>
            </li>
            <li v-if="isSuperUser" class="nav-item">
              <router-link to="/admin" class="nav-link mx-2">Admin</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <a @click="handleLogout" class="nav-link mx-2" href="#">Logout</a>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link to="/login" class="nav-link mx-2">Login</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const isLoggedIn = computed(() => authStore.isLoggedIn)
    const isSuperUser = computed(() => authStore.isSuperUser)
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }
    onMounted(() => {
      authStore.checkAuth()
    })
    return { isLoggedIn, isSuperUser, handleLogout }
  }
}
</script>
