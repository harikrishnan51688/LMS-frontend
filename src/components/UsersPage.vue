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
                    <th>Role</th>
                    

                </tr>
            </thead>
            <tbody>
                <tr v-for="user in allusers" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td><router-link :to="{name: 'profile', params: { user_id: user.id} }"> {{ user.name }}</router-link></td>
                    <td><router-link :to="{name: 'profile', params: { user_id: user.id} }">{{ user.email }}</router-link></td>
                    <td><router-link :to="{name: 'profile', params: { user_id: user.id} }">{{ user.date }}</router-link></td>
                    
                    <td>{{ user.request_count }}</td>
                    <td>{{ user.borrow_count }}</td>
                    <td>{{ user.return_count }}</td>
                    <td>{{ user.role }}</td>
                    <td v-if="user.role !== 'admin'">
                    <a @click="removeUser(user.id)" class="remove-button">
                    <span class="badge bg-danger rounded-pill">Remove</span></a></td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {useToast} from 'vue-toast-notification'

const user = JSON.parse(localStorage.getItem('user')) || null
const $toast = useToast()
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

const removeUser = async (user_id) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/removeuser', {
      headers: { 'x-access-token': user.token },
      params: {'user_id': user_id}
    })
    if (response.status === 200){
      $toast.default(response.data.message, {
            duration: 2000,
            type: response.data.status,
            position: 'top-right'
          })
      await getusers()
    }
  } catch(error){
    console.error("Error removing user", error)
  }
}

onMounted(() => {
  getusers()
})
</script>

<style scoped>
.remove-button {
  cursor: pointer;
}
</style>