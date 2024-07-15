<template>
  <Sidebar />

  <div class="container mt-5">
    <div class="d-flex align-items-center">
      <h2>Section: {{ section.section_name }}&nbsp;</h2>
      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <img :src="`http://127.0.0.1:5000/static/uploads/edit.svg`" alt="My Happy SVG"/>
      </a>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">{{ section.section_name }}</label>
              <input v-model="section_name" type="email" class="form-control" id="exampleFormControlInput1">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button @click="updateSection(section.section_id)" type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Genre</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <!-- {% for book in ebooks %} -->
        <tr v-for="book in section.books" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.genre }}</td>
          <td>{{ book.author }}</td>
          <td>
            <a href="#">
              <span @click="removeBookFromSection(book.id)" class="badge bg-danger rounded-pill"
                >Remove</span
              >
            </a>
          </td>
        </tr>
        <!-- {% endfor %} -->
      </tbody>
    </table>
  </div>
  <div class="container mt-5">
    <div class="d-flex align-items-center">
      <h2>Add Book:</h2>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Genre</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in remaining_books.books" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.genre }}</td>
          <td>{{ book.author }}</td>
          <td>
            <a href="#">
              <span @click="addBookToSection(book.id)" class="badge bg-primary rounded-pill"
                >Add to section</span
              >
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const $toast = useToast()
const user = JSON.parse(localStorage.getItem('user')) || null

const section_id = ref('')
const section = ref({})
const remaining_books = ref({})
const section_name = ref(null)

const getSection = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/section/${section_id.value}`)
    section.value = response.data
  } catch (error) {
    console.error('Error fetching sections', error)
  }
}

const bookNotInSection = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/section/remaining-books', {
      params: { section_id: section_id.value }
    })
    remaining_books.value = response.data
  } catch (error) {
    console.error('Error fetching sections', error)
  }
}

const addBookToSection = async (book_id) => {
  try {
    const response = await axios.get('http://localhost:5000/api/section/add-book', {
      headers: { 'x-access-token': user.token },
      params: { section_id: section_id.value, book_id: book_id }
    })
    if (response.status === 200) {
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status
      })
      getSection()
      bookNotInSection()
    }
  } catch (error) {
    console.error('Error adding book to section', error)
  }
}

const removeBookFromSection = async (book_id) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/section/remove-book', {
      headers: { 'x-access-token': user.token },
      params: { section_id: section_id.value, book_id: book_id }
    })
    if (response.status === 200) {
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status
      })
      getSection()
      bookNotInSection()
    }
  } catch (error) {
    console.error('Error removing book from section', error)
  }
}

const updateSection = async (section_id) => {
  try{
    const formdata = new FormData()
    formdata.append('section_name', section_name.value)
    const response = await axios.put(`http://localhost:5000/api/section/update-section/${section_id}`, formdata, {
      headers: { 'x-access-token': user.token },
  })
  if (response.status === 200){
    $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status
      })
      getSection()
  } 
} catch (error) {
  console.error('Error update section name', error)
}
}

onMounted(() => {
  section_id.value = route.params.section_id
  getSection()
  bookNotInSection()
})
</script>
