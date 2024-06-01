<template>
  <Sidebar />

  <div class="container mt-5">
    <div class="d-flex align-items-center">
      <h2>Section: {{ section.section_name }}&nbsp;</h2>
      <!-- <a href="{{ url_for('edit_section', section_id=section.section_id) }}"> -->
      <!-- <img src = "{{ url_for('static', filename='uploads/edit.svg')}}" alt="My Happy SVG"/> -->
      <!-- </a> -->
    </div>
    <!-- <a class="btn btn-primary" href="{{ url_for('books', section_id=section.section_id) }}">Add book</a> -->
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
      <!-- <a href="{{ url_for('edit_section', section_id=section.section_id) }}"> -->
      <!-- <img src = "{{ url_for('static', filename='uploads/edit.svg')}}" alt="My Happy SVG"/> -->
      <!-- </a> -->
    </div>
    <!-- <a class="btn btn-primary" href="{{ url_for('books', section_id=section.section_id) }}">Add book</a> -->
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
        <!-- {% endfor %} -->
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

const getSection = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/sections/${section_id.value}`)
    section.value = response.data
  } catch (error) {
    console.error('Error fetching sections', error)
  }
}

const bookNotInSection = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/section/remaining-books', {
      params: { section_id: section_id.value }
    })
    remaining_books.value = response.data
  } catch (error) {
    console.error('Error fetching sections', error)
  }
}

const addBookToSection = async (book_id) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/section/add-book', {
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
    const response = await axios.delete('http://127.0.0.1:5000/api/section/remove-book', {
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

onMounted(() => {
  section_id.value = route.params.section_id
  getSection()
  bookNotInSection()
})
</script>
