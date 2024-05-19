<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5">Login</h2>
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

            <form @submit.prevent="login" class="form">

              <div class="mb-3 required">
                <label class="form-label" for="email">Email</label>
                <input
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  type="text"
                />
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

              <input
                class="btn btn-primary btn-md"
                id="submit"
                name="submit"
                type="submit"
                value="Login"
              />
            </form>

            <div id="emailHelp" class="form-text text-center mb-5 text-dark">
              Not Registered?
              <router-link to="/register" class="text-dark fw-bold"> Create an Account</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async () => {
      try {
        await authStore.login(email.value, password.value);
        router.push('/');
      } catch (error) {
        console.error('Failed to login', error);
      }
    };

    return { email, password, login };
  },
};
</script>