<template>
  <div class="position-absolute top-1 end-0 m-3">
    <button @click="requestData()" type="button" class="btn btn-primary btn-sm me-1">
      Export data
    </button>
    <a v-if="download_link" :href="`http://127.0.0.1:5000/static/${download_link}`">
    <button type="button" class="btn btn-primary btn-sm">Download</button>
    </a>
    <!-- <a v-else>
    <button v-if="task_id" @click="downloadData()" type="button" class="btn btn-primary btn-sm">Download</button>
    </a> -->
  </div>

  <div v-if="pending_requests.length > 0" class="container mt-4">
    <h2>Pending requests</h2>
    <ul class="list-group">
      <li
        v-for="request in pending_requests"
        :key="request.request_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex">
          <img
            :src="`http://127.0.0.1:5000/static/${request.book_details.image}`"
            class="me-3"
            alt="Product 1"
            style="width: 64px; height: 106px"
          />
          <div>
            <h5 class="mt-0">{{ request.book_details.title }}</h5>
            {{ request.book_details.subtitle }}
          </div>
        </div>
        <!-- <span class="badge bg-primary rounded-pill">$19.99</span> -->
        <div>
          <!-- <a href="{{ url_for('cancel_request', request_id=request.request_id )}}"> -->
          <button
            @click="cancelRequest(request.request_id)"
            type="button"
            class="btn btn-danger rounded-pill btn-sm"
          >
            cancel request
          </button>
          <!-- </a> -->
        </div>
      </li>
    </ul>
  </div>

  <div v-if="borrowed_books.length > 0" class="container mt-4">
    <h2>Borrowed books</h2>
    <ul class="list-group">
      <li
        v-for="book in borrowed_books"
        :key="book.borrow_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex">
          <img
            :src="`http://127.0.0.1:5000/static/${book.book_details.image}`"
            class="me-3"
            alt="Product 1"
            style="width: 64px; height: 106px"
          />
          <div>
            <h5 class="mt-0">{{ book.book_details.title }}</h5>
            {{ book.book_details.subtitle }}<br />
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                :id="'flexSwitchCheckDefault' + book.borrow_id"
                v-model="book.auto_expiry"
                @click="toggleExpiry(book.borrow_id)"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault">Auto expiry</label>
            </div>
            <span class="badge bg-secondary rounded-pill">Issued on: </span> {{ book.release_date
            }}<br />
            <span class="badge bg-secondary rounded-pill">Due date: </span> {{ book.due_date
            }}<br />
          </div>
        </div>
        <!-- <span class="badge bg-primary rounded-pill">$19.99</span> -->
        <div>
          <a v-if="isSuperUser" href="#">
            <button
              @click="returnBook(book.borrow_id, book.book_id)"
              type="button"
              class="btn btn-danger rounded-pill btn-sm me-1"
            >
              revoke
            </button>
          </a>
          <a v-if="isLoggedIn & !isSuperUser">
            <button
              @click="returnBook(book.borrow_id, book.book_id)"
              type="button"
              class="btn btn-dark rounded-pill btn-sm me-1"
            >
              return
            </button>
          </a>
          <a
            :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.book_details.file}`"
            type="application/pdf"
            target="_blank"
          >
            <button v-if="isLoggedIn" type="button" class="btn btn-secondary rounded-pill btn-sm">
              view
            </button>
          </a>
        </div>
      </li>
    </ul>
  </div>

  <div v-if="returned_books.length > 0" class="container mt-4">
    <h2>Returned books</h2>
    <ul class="list-group">
      <li
        v-for="book in returned_books"
        :key="book.return_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex">
          <img
            :src="`http://127.0.0.1:5000/static/${book.book_details.image}`"
            class="me-3"
            alt="Product 1"
            style="width: 64px; height: 106px"
          />
          <div>
            <h5 class="mt-0">{{ book.book_details.title }}</h5>
            {{ book.book_details.subtitle }}<br />
            <span class="badge bg-secondary rounded-pill">Returned on: </span> {{ book.return_date
            }}<br />
          </div>
        </div>
      </li>
    </ul>
  </div>
  <br /><br />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
const isSuperUser = computed(() => authStore.isSuperUser)
const route = useRoute()
const $toast = useToast()

const pending_requests = ref([])
const borrowed_books = ref([])
const returned_books = ref([])
const user = JSON.parse(localStorage.getItem('user')) || null
const user_id = ref('')
const task_id = ref(localStorage.getItem('task_id') || null)
const download_link = ref(null)
let alert = false
let interval = null


const getProfile = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/profile', {
      headers: { 'x-access-token': user.token },
      params: { user_id: user_id.value }
    })
    pending_requests.value = response.data.pending_requests
    returned_books.value = response.data.returned_books
    borrowed_books.value = response.data.borrowed_books
  } catch (error) {
    console.error('Error fetching UserProfile details', error)
  }
}

const cancelRequest = async (request_id) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/cancelrequest', {
      headers: { 'x-access-token': user.token },
      params: { request_id: request_id }
    })
    if (response.status === 200) {
      await getProfile()
    }
  } catch (error) {
    console.error('Error canceling request', error)
  }
}

const returnBook = async (borrow_id, book_id) => {
  try {
    const response = await axios.get('http://localhost:5000/api/returnbook', {
      headers: { 'x-access-token': user.token },
      params: { borrow_id: borrow_id, book_id: book_id, user_id: user_id.value }
    })
    if (response.status === 200) {
      await getProfile()
    }
  } catch (error) {
    console.error('Error returning book', error)
  }
}

const toggleExpiry = async (borrow_id) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/toggle-expiry',
      { borrow_id: borrow_id },
      {
        headers: { 'x-access-token': user.token }
      }
    )
    if (response.status === 200) {
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status,
        position: 'top-right'
      })
      await getProfile()
    }
  } catch (error) {
    console.error('Error toggling expiry', error)
  }
}


const requestData = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/request-data',
      {},
      {
        headers: { 'x-access-token': user.token }
      }
    )
    console.log(response.data)
    if (response.status === 200 && interval === null) {
      localStorage.setItem('task_id', response.data.task_id)
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status,
        position: 'top-right'
      })
      alert = true
      interval = setInterval(() => downloadData(response.data.task_id), 2000)
    }
  } catch (error) {
    console.error('Error requesting data', error)
  }
}

const downloadData = async (task_id) => {
  try {
    const response = await axios.get('http://localhost:5000/api/download-data', {
      headers: { 'x-access-token': user.token },
      params: { 'task_id': task_id }
    })
    if (response.data.status === 'success') {
      download_link.value = response.data.path
      clearInterval(interval)
      if (alert){
      $toast.default(response.data.message, {
        duration: 2000,
        type: response.data.status,
        position: 'top-right'
      })
    }
    }
  } catch (error) {
    console.error('Error requesting data', error)
  }
}


onMounted(() => {
  ;(user_id.value = route.params.user_id), getProfile(), downloadData(task_id.value)
})

</script>
