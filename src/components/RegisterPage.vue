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

            <form @submit.prevent="login" class="form">
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
                <input class="form-control" id="name" v-model="email" required type="text" />
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
