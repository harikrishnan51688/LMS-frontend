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
            <span class="badge bg-primary rounded-pill me-1 remove-button">Edit book</span>
            <span @click="removeBook(book.id)" class="badge bg-danger rounded-pill me-1 remove-button"
              >Delete</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '@/components/SidebarLine.vue'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const user = JSON.parse(localStorage.getItem('user')) || null
const allbooks = ref([])

const getBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/books')
    allbooks.value = response.data.books
  } catch (error) {
    console.error('Error fetching books data', error)
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
