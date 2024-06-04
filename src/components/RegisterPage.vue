<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5">Register</h2>
        <div class="text-center mb-5 text-dark">Made with bootstrap</div>
        <div class="card my-5">
          <div class="card-body cardbody-color p-lg-5">
            <div class="text-center">
              <img
                src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                width="200px"
                alt="profile"
              />
            </div>

            <form @submit.prevent="register" class="form">
              <div class="mb-3 required">
                <label class="form-label" for="email">Email</label>
                <input class="form-control" id="email" v-model="email" required type="text" />
              </div>

              <div class="mb-3 required">
                <label class="form-label" for="password">Password</label>
                <input
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  type="password"
                />
              </div>

              <div class="mb-3 required">
                <label class="form-label" for="name">Name</label>
                <input class="form-control" id="name" v-model="name" required type="text" />
              </div>

              <input
                class="btn btn-primary btn-md"
                id="submit"
                name="submit"
                type="submit"
                value="Sign up"
              />
            </form>

            <div id="emailHelp" class="form-text text-center mb-5 text-dark">
              Already have an account?
              <router-link to="/login" class="text-dark fw-bold">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const authStore = useAuthStore()
const $toast = useToast()
const router = useRouter()
const email = ref('')
const password = ref('')
const name = ref('')

const register = async () => {
  try {
    const response = await authStore.register(email.value, password.value, name.value)
    console.log(response)
    if (response.token) {
      $toast.success('Account created', {
        duration: 2000,
        position: 'top-right'
      })
      router.push('/')
    }
    if (response.message) {
      $toast.default(response.message, {
        type: response.status,
        duration: 2000,
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error while creating account', error)
  }
}
</script>
