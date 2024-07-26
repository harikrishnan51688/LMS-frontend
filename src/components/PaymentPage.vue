<template>
    <Sidebar />
    <div class="container mt-5">
      <h2>Purchases</h2>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>BookName</th>
            <th>Amount</th>
            <th>Purchased at</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments.data" :key="payment.id">
            <td>{{ payment.id }}</td>
            <td>{{ payment.username }}</td>
            <td>{{ payment.bookname }}</td>
            <td>₹{{ payment.amount }}</td>
            <td>{{ payment.purchase_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from './SidebarLine.vue';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user')) || null
const payments = ref({})

const getPayments = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/book-purchases',{
        headers: { 'x-access-token': user.token },
    })
    payments.value = response.data
  } catch (error) {
    console.error('Error fetching payment data', error)
  }
}

onMounted(() => {
    getPayments()
})
</script>