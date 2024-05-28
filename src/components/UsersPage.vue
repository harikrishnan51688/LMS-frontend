<template>
  <Sidebar />
  <div class="container mt-5">
        <h2>User List</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date joined</th>
                    <th>Current requests</th>
                    <th>Borrowed books</th>
                    <th>Returned books</th>
                    <th>Is superuser</th>
                    

                </tr>
            </thead>
            <tbody>
                <tr v-for="user in allusers" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td> <a href="{{ url_for('user', user_id=user.id) }}"> {{ user.name }}</a></td>
                    <td><a href="{{ url_for('user', user_id=user.id) }}">{{ user.email }}</a></td>
                    <td><a href="{{ url_for('user', user_id=user.id) }}">{{ user.date }}</a></td>
                    <td>{{ user.request_count }}</td>
                    <td>{{ user.borrow_count }}</td>
                    <td>{{ user.return_count }}</td>
                    <td>{{ user.is_superuser }}</td>
                    <td v-if="!user.is_superuser">
                    <!-- <a href="{{ url_for('delete_user', user_id=user.id )}}"> -->
                    <span class="badge bg-danger rounded-pill">Remove</span></td>
                    <!-- </a> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user')) || null
const allusers = ref([])

const getusers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/allusers', {
      headers: { 'x-access-token': user.token }
    })
    allusers.value = response.data.user_data
  } catch (error) {
    console.error('Error fetching users data', error)
  }
}
onMounted(() => {
  getusers()
})
</script>
