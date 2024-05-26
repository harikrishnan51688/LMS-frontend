<template>
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
            <button @click="cancelRequest(request.request_id)" type="button" class="btn btn-danger rounded-pill btn-sm">cancel request</button>
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
            <span class="badge bg-secondary rounded-pill">Issued on: </span> {{ book.release_date
            }}<br />
            <span class="badge bg-secondary rounded-pill">Due date: </span> {{ book.due_date
            }}<br />
          </div>
        </div>
        <!-- <span class="badge bg-primary rounded-pill">$19.99</span> -->
        <div>
          <a
            v-if="isSuperUser"
            href="{{ url_for('revoke_access', user_id=user_id, book_id=book.id, borrow_id=book_.borrow_id ) }}"
          >
            <button type="button" class="btn btn-danger rounded-pill btn-sm me-1">revoke</button>
          </a>
          <a
            v-if="isLoggedIn & !isSuperUser"
          >
            <button @click="returnBook(book.borrow_id, book.book_id)" type="button" class="btn btn-dark rounded-pill btn-sm me-1">return</button>
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
<br><br>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import axios from 'axios'

export default {
  name: 'BookPage',
  setup() {
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => authStore.isLoggedIn)
    const isSuperUser = computed(() => authStore.isSuperUser)

    return { isLoggedIn, isSuperUser }
  },
  data() {
    return {
      pending_requests: [],
      borrowed_books: [],
      returned_books: [],
      user: JSON.parse(localStorage.getItem('user')) || null
    }
  },
  methods: {
    async getProfile() {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { 'x-access-token': this.user.token }
        })
        this.pending_requests = response.data.pending_requests
        this.returned_books = response.data.returned_books
        this.borrowed_books = response.data.borrowed_books
      } catch (error) {
        console.error('Error fetching UserProfile details', error)
      }
    },
    async cancelRequest(request_id) {
      try {
        const response = await axios.delete('http://localhost:5000/api/cancelrequest', {
          headers: { 'x-access-token': this.user.token },
          params: { 'request_id': request_id }
        })
        if(response.status === 200){
          await this.getProfile()
        }
      } catch(error) {
        console.error("Error canceling request", error)
      }
    },
    async returnBook(borrow_id, book_id) {
      try {
        const response = await axios.get('http://localhost:5000/api/returnbook', {
          headers: { 'x-access-token': this.user.token },
          params: { 'borrow_id': borrow_id, 'book_id': book_id }
        })
        if(response.status === 200){
          await this.getProfile()
        }
      } catch(error) {
        console.error("Error returning book", error)
      }
    }
  },
  created() {
    this.getProfile()
  }
}
</script>
