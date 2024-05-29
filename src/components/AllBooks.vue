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
              <span class="badge bg-primary rounded-pill me-1">Edit book</span>
              <span class="badge bg-danger rounded-pill me-1">Delete</span>
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
  
  const allbooks = ref([])
  
  const getBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books')
      allbooks.value = response.data.books
    } catch (error) {
      console.error('Error fetching books data', error)
    }
  }
  
  onMounted(() => {
    getBooks()
  })
  </script>
  