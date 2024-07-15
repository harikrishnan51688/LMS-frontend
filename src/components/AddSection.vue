<template>
  <Sidebar />
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5">Add Section</h2>
        <div class="text-center mb-5 text-dark">Made with bootstrap</div>
        <div class="card my-5">
          <div class="card-body cardbody-color p-lg-5">
            <div class="text-center">
              <img
                src="https://cdn.pixabay.com/photo/2019/09/30/14/29/books-4515917_640.jpg"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                width="200px"
                alt="profile"
              />
            </div>
            <form @submit.prevent="addSection">
              <div class="mb-3">
                <label for="title" class="form-label">Section name</label>
                <input v-model="sectionName" class="form-control" id="title" required />
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const user = JSON.parse(localStorage.getItem('user')) || null

const sectionName = ref('')

const addSection = async () => {
  try {
    const formdata = new FormData()
    formdata.append('section_name', sectionName.value)

    const response = await axios.post('http://localhost:5000/api/section/add-section', formdata, {
      headers: { 'x-access-token': user.token }
    })
    if (response.status === 200) {
      $toast.default(response.data.message, {
        type: response.data.status,
        duration: 2000
      })
      sectionName.value = ''
    }
  } catch (error) {
    console.error('Error uploading form', error)
  }
}
</script>
