<template>
  <Sidebar />
  <div class="container mt-5">
    <h2>All books</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Price</th>
          <th>Created at</th>
          <th>Sections</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in allbooks" :key="book.id">
          <td>{{ book.id }}</td>
          <td>
            <router-link :to="`/book/${book.id}`">{{ book.title }}</router-link>
          </td>
          <td>{{ book.author }}</td>
          <td>{{ book.genre }}</td>
          <td>₹{{ book.price }}</td>
          <td>{{ book.created_at }}</td>
          <td>
            <span v-for="(section, index) in book.sections" :key="index">
              {{ section }}<span v-if="index < book.sections.length - 1">, </span>
            </span>
          </td>
          <td>
            <span @click="getBook(book.id)" class="badge bg-primary rounded-pill me-1 remove-button" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit book</span>
            <span @click="removeBook(book.id)" class="badge bg-danger rounded-pill me-1 remove-button"
              >Delete</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Book</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        
        <form @submit.prevent="updateBook">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input v-model="form.title" class="form-control" id="title" required/>
              </div>
              <div class="mb-3">
                <label for="subtitle" class="form-label">Subtitle</label>
                <input v-model="form.subtitle" class="form-control" id="subtitle" required/>
              </div>
              <div class="mb-3">
                <label for="genre" class="form-label">Genre</label>
                <input v-model="form.genre" class="form-control" id="genre" required/>
              </div>
              <div class="mb-3">
                <label for="pages" class="form-label">No. of pages</label>
                <input v-model="form.pages" class="form-control" id="pages" min="1" type="number" required>
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">Author</label>
                <input v-model="form.author" class="form-control" id="author" required/>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input v-model="form.price" class="form-control" id="price" min="1" type="number" required/>
              </div>
              <div class="mb-3">
                <label for="file" class="form-label">File upload</label>
                <input @change="handleFileUpload($event, 'file')" class="form-control" id="file" type="file"/>
                <a :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${file}`" target="_blank" class="link-primary">Show current file</a>
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Image</label>
                <input @change="handleFileUpload($event, 'image')" class="form-control" id="image" type="file"/>
                <a :href="`http://127.0.0.1:5000/static/${image}`" target="_blank" class="link-primary">Show current image</a>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
      </div>
    </div>
  </div>
</div>


</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import Sidebar from '@/components/SidebarLine.vue'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const user = JSON.parse(localStorage.getItem('user')) || null
const allbooks = ref({})
const file = ref(null)
const image = ref(null)

const form = ref({
      'id': '',
      'title' : '',
      'subtitle':  '' ,
      'genre' : '',
      'pages' : 1,
      'author' : '',
      'price' : 1,
      'file' : null,
      'image' : null,
})
const $loading =  inject('$loading')

const loader = $loading.show({
    width: 30,
    height: 35,
    color: 'blue'
    });

const getBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/books')
    allbooks.value = response.data.books
    loader.hide()
  } catch (error) {
    console.error('Error fetching books data', error)
  }
}

const getBook = async (book_id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/book/${book_id}`)
    const book = response.data.book
    form.value = {
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      genre: book.genre,
      pages: book.pages,
      author: book.author,
      price: book.price,
      file: book.file,
      image: book.image
    }
    file.value = book.file
    image.value = book.image
  } catch(error) {
    console.error("Error fetching book", error)
  }
}

const updateBook = async () => {
  try {
    const formdata = new FormData()
    formdata.append('title', form.value.title)
    formdata.append('subtitle', form.value.subtitle)
    formdata.append('genre', form.value.genre)
    formdata.append('pages', form.value.pages)
    formdata.append('author', form.value.author)
    formdata.append('price', form.value.price)
    if (form.value.file){
      formdata.append('file', form.value.file)
    }
    if (form.value.image){
      formdata.append('image', form.value.image)
    }
    const response = await axios.put(`http://localhost:5000/api/update-book/${form.value.id}`, formdata, {
      headers: { 'x-access-token': user.token },
      'Content-Type': 'multipart/form-data',
    })
    if (response.status === 200){
      $toast.default(response.data.message, {
            type: response.data.status,
            duration: 2000
          })
          await getBooks()
          await getBook()
    }
    } catch(error){
      console.error("Error updating book", error)
    }
  }

const handleFileUpload = (event, type) => {
  const files = event.target.files;
  if (files.length > 0) {
    if (type === 'file') {
      form.value.file = files[0];
    } else if (type === 'image') {
      form.value.image = files[0];
    }
  }
}

const removeBook = async (book_id) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/delete-book', {
      headers: { 'x-access-token': user.token },
      params: { book_id: book_id }
    })
    if (response.status === 200) {
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status
      })
      await getBooks()
    }
  } catch (error) {
    console.error('Error while removing book', error)
  }
}

onMounted(() => {
  getBooks()
})
</script>

<style scoped>
.remove-button {
  cursor: pointer;
}
</style>
