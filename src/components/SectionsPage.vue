<template>
  <Sidebar />
  <div class="container mt-5">
    <h2>Section List</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date created</th>
          <th>No of books</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="section in sections" :key="section.section_id">
          <td>{{ section.section_id }}</td>
          <td>{{ section.section_name }}</td>
          <td>{{ section.created_at }}</td>
          <td>{{ section.book_count }}</td>
          <td>
            <router-link
              :to="{ name: 'managesection', params: { section_id: section.section_id } }"
            >
              <span class="badge bg-primary rounded-pill">Manage books</span></router-link
            >
          </td>
          <td>
            <a href="#">
              <span @click="removeSection(section.section_id)" class="badge bg-danger rounded-pill">Delete</span>
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
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const sections = ref([])
const user = JSON.parse(localStorage.getItem('user')) || null

const getSections = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/section/all')
    sections.value = response.data.sections
  } catch (error) {
    console.error('Error fetching sections', error)
  }
}

const removeSection = async (section_id) => {
  try {
    console.log(section_id)
    const response = await axios.delete(`http://localhost:5000/api/section/delete-section/${section_id}`, {
      headers: { 'x-access-token': user.token }
    })
    if (response.status === 200) {
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status
      })
      getSections()
    }
  } catch (error) {
    console.error('Error removing section', error)
  }
}

onMounted(() => {
  getSections()
})
</script>
