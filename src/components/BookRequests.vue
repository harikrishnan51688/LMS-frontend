<template>
  <Sidebar />
  <div class="container mt-4">
    <h2>Requests</h2>
    <ul class="list-group">
      <li
        v-for="request in requests"
        :key="request.request_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex">
          <img
            :src="`http://127.0.0.1:5000/static/${request.book_image}`"
            class="me-3"
            alt="Product 1"
            style="width: 64px; height: 106px"
          />
          <div>
            <h5 class="mt-0">{{ request.book_name }}</h5>
            <span class="badge bg-secondary rounded-pill">user:</span> {{ request.user_name }}
          </div>
        </div>
        <!-- <span class="badge bg-primary rounded-pill">$19.99</span> -->
        <div>
          <a href="{{ url_for('approve_request', request_id=request.request_id) }}">
            <button type="button" class="btn btn-success rounded-pill btn-sm me-1">Approve</button>
          </a>
          <a href="{{ url_for('cancel_request', request_id=request.request_id )}}">
            <button type="button" class="btn btn-danger rounded-pill btn-sm me-1">Cancel</button>
          </a>
        </div>
      </li>
    </ul>
    <span v-if="requests.length === 0" class="badge bg-secondary rounded-pill">No requests</span>
    <br />
    <br />
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user')) || null
const requests = ref([])

const getrequests = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/book-requests', {
      headers: { 'x-access-token': user.token }
    })
    requests.value = response.data.requests
  } catch (error) {
    console.error('Error fetching user requests', error)
  }
}
onMounted(() => {
  getrequests()
})
</script>
