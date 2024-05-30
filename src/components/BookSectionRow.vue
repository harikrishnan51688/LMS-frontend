<template>
  <div v-for="book in books" :key="book.id" class="col-lg-3 col-md-6 mb-4">
    <div>
      <router-link :to="{ name: 'book', params: { id: book.id } }">
        <img
          class="card-img-top img-fluid"
          style="width: 200px; height: 300px"
          :src="`http://127.0.0.1:5000/static/${book.image}`"
          alt="Book Image 1"
        />
        <div class="card-body">
          <h4 class="card-title">{{ book.title }}</h4>
          <p class="card-text">{{ book.subtitle }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const props = defineProps({
  section_id: {
    type: Number,
    required: true
  }
})

const books = ref([])

const getBooksFromSection = async () => {
  const path = `http://localhost:5000/api/sections/${props.section_id}`
  try {
    const response = await axios.get(path)
    books.value = response.data.books
  } catch (error) {
    console.error('Error fetching book from sections', error)
  }
}

onMounted(() => {
  getBooksFromSection()
})
</script>
