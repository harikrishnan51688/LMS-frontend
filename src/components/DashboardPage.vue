<template>
  <Sidebar />
  <div class="content">
    <h2>Dashboard</h2>

    <!-- Stats Containers -->
    <div class="row justify-content-center mb-3">
      <div class="col-xs-10 col-sm-4 col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Total Books</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-books">{{ total_books }}</h5>
          </div>
        </div>
      </div>
      <div class="col-xs-10 col-sm-4 col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Total Users</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-users">{{ total_users }}</h5>
          </div>
        </div>
      </div>
      <div class="col-xs-10 col-sm-4 col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Total Sections</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-sections">{{ total_sections }}</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center mb-3">
      <div class="col-xs-10 col-sm-2 col-md-3">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Pending requests</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-books">{{ total_requests }}</h5>
          </div>
        </div>
      </div>
      <div class="col-xs-10 col-sm-2 col-md-3">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Total borrowed</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-users">{{ current_borrowed }}</h5>
          </div>
        </div>
      </div>
      <div class="col-xs-10 col-sm-2 col-md-3">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Total returned</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-sections">{{ total_returned }}</h5>
          </div>
        </div>
      </div>
      <div class="col-xs-10 col-sm-2 col-md-3">
        <div class="card bg-light mb-3">
          <div class="card-header text-center">Active users</div>
          <div class="card-body">
            <h5 class="card-title text-center" id="total-sections">{{ active_users }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Containers -->
    <div class="row justify-content-center">
      <div class="col-xs-10 col-sm-6 col-md-6">
        <div class="card-body">
          <h4 class="text-center mb-3">Section</h4>
          <div class="chart-container">
            <canvas id="sections" class="chart"></canvas>
          </div>
        </div>
      </div>

      <div class="col-xs-10 col-sm-6 col-md-6">
        <div class="card-body">
          <h4 class="text-center mb-3">Users</h4>
          <div class="chart-container">
            <canvas id="users" class="chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { Chart } from 'chart.js/auto'

const current_borrowed = ref(null)
const total_books = ref(null)
const total_requests = ref(null)
const total_returned = ref(null)
const total_sections = ref(null)
const total_users = ref(null)
const active_users = ref(null)

const user = JSON.parse(localStorage.getItem('user')) || null
const $loading =  inject('$loading')

const loader = $loading.show({
    width: 30,
    height: 35,
    color: 'blue'
    });

const getStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/stats', {
      headers: { 'x-access-token': user.token }
    })
    const data = response.data.data
    total_books.value = data.total_books
    total_users.value = data.total_users
    total_sections.value = data.total_sections
    total_requests.value = data.total_requests
    current_borrowed.value = data.current_borrowed
    total_returned.value = data.total_returned
    active_users.value = data.active_users
    loader.hide()
  } catch (error) {
    console.error('Error fetching stats', error)
  }
}

const createSectionChart = () => {
  fetch('http://127.0.0.1:5000/api/chart/sections')
    .then((response) => response.json())
    .then((data) => {
      var ctx = document.getElementById('sections')
      new Chart(ctx, {
        type: 'pie',
        data: data.chart_data,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    })
}

const createUserChart = () => {
  fetch('http://127.0.0.1:5000/api/chart/users')
    .then((response) => response.json())
    .then((data) => {
      var ctx = document.getElementById('users')
      new Chart(ctx, {
        type: 'line',
        data: data.chart_data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MMM D'
                  }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }
            ],
            y: {
              beginAtZero: true,
              scaleLabel: {
                display: true,
                labelString: 'Number of Users'
              }
            }
          }
        }
      })
    })
}

onMounted(() => {
  getStats()
  createSectionChart()
  createUserChart()
})
</script>
