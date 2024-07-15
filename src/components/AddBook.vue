<template>
  <Sidebar />
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5">Add book</h2>
        <div class="text-center mb-5 text-dark">Made with bootstrap</div>
        <div class="card my-5">
          <div class="card-body cardbody-color p-lg-5">
            <div class="text-center">
              <img
                src="https://cdn.pixabay.com/photo/2016/01/09/18/28/notebook-1130742_640.jpg"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                width="200px"
                alt="profile"
              />
            </div>
            <form @submit.prevent="addbook">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input v-model="title" class="form-control" id="title" required/>
              </div>
              <div class="mb-3">
                <label for="subtitle" class="form-label">Subtitle</label>
                <input v-model="subtitle" class="form-control" id="subtitle" required/>
              </div>
              <div class="mb-3">
                <label for="genre" class="form-label">Genre</label>
                <input v-model="genre" class="form-control" id="genre" required/>
              </div>
              <div class="mb-3">
                <label for="pages" class="form-label">No. of pages</label>
                <input v-model="pages" class="form-control" id="pages" value="" min="1" type="number" required>
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">Author</label>
                <input v-model="author" class="form-control" id="author" required/>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input v-model="price" class="form-control" id="price" min="1" value="" type="number" required/>
              </div>
              <div class="mb-3">
                <label for="file" class="form-label">File upload</label>
                <input @change="handleFileUpload($event, 'file')" class="form-control" id="file" type="file" required/>
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Image</label>
                <input @change="handleFileUpload($event, 'image')" class="form-control" id="image" type="file" required/>
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
import {useToast} from 'vue-toast-notification'

const $toast = useToast()
const user = JSON.parse(localStorage.getItem('user')) || null

const title = ref('')
const subtitle = ref('')
const genre = ref('')
const pages = ref(1)
const author = ref('')
const price = ref(1)
const file = ref(null)
const image = ref(null)

const addbook = async() => {
  try {
    const formdata = new FormData()
    formdata.append('title', title.value)
    formdata.append('subtitle' ,subtitle.value)
    formdata.append('genre', genre.value)
    formdata.append('pages', pages.value)
    formdata.append('author', author.value)
    formdata.append('price', price.value)
    formdata.append('file', file.value)
    formdata.append('image', image.value)
    const response = await axios.post('http://localhost:5000/api/book/add-book', formdata, {
      headers: { 'x-access-token': user.token },
      'Content-Type': 'multipart/form-data',
    })
    if (response.status === 200){
        $toast.default(response.data.message, {
            type: response.data.status,
            duration: 2000
          })
        resetFormFields()
    }
  } catch(error) {
    console.error("Error uploading form", error)
  }
}

const handleFileUpload = (event, type) => {
  const files = event.target.files;
  if (files.length > 0) {
    if (type === 'file') {
      file.value = files[0];
    } else if (type === 'image') {
      image.value = files[0];
    }
  }
}

const resetFormFields = () => {
  title.value = '';
  subtitle.value = '';
  genre.value = '';
  pages.value = 1;
  author.value = '';
  price.value = 1;
  file.value = null;
  image.value = null;
  document.getElementById('file').value = '';
  document.getElementById('image').value = '';
}
</script>
