<template>
  <div class="container mt-5">
    <h1 class="mb-4">{{ book.title }}</h1>

    <div class="row">
      <div class="col-md-3">
        <img
          :src="`http://127.0.0.1:5000/static/${book.image}`"
          alt="Book Cover"
          class="img-fluid"
        />
      </div>
      <div class="col-md-6">
        <h4 class="mb-3">Details</h4>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>
        <p><strong>Published Date:</strong> {{ book.created_at }}</p>
        <p><strong>Description:</strong> {{ book.subtitle }}</p>
        <p><strong>Price:</strong> ₹{{ book.price }}</p>

        <button
          v-if="isLoggedIn"
          type="button"
          class="btn btn-primary me-1"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Buy
        </button>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Buy</h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                Purchase this book "{{ book.title }}" at ₹{{ book.price }}?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <a href="{{ url_for('static', filename=book.file) }}"
                  ><button type="button" class="btn btn-primary">Buy it</button></a
                >
              </div>
            </div>
          </div>
        </div>
        <a
          v-if="isBookBorrowed & !isSuperUser"
          :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.file}`"
          type="application/pdf"
          target="_blank"
        >
          <button class="btn btn-secondary me-1">Read</button>
        </a>
        <a
          v-if="!isSuperUser & !isBookBorrowed"
        >
          <button @click="requestBook(book.id)" class="btn btn-primary me-1">Request book</button>
        </a>
        <a
          v-if="isSuperUser"
          :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.file}`"
          type="application/pdf"
          target="_blank"
        >
          <button class="btn btn-secondary me-1">View</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import axios from 'axios'
import {useToast} from 'vue-toast-notification';

export default {
  name: 'BookPage',
  setup() {
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => authStore.isLoggedIn)
    const isSuperUser = computed(() => authStore.isSuperUser)
    const $toast = useToast();

    return { isLoggedIn, isSuperUser, $toast }
  },
  data() {
    return {
      id: null,
      book: [],
      user: JSON.parse(localStorage.getItem('user')) || null,
      isBookBorrowed: false
    }
  },
  methods: {
    async getBook() {
      try {
        const response = await axios.get(`http://localhost:5000/api/book/${this.id}`)
        this.book = response.data.book
      } catch (error) {
        console.log('Error fetching book', error)
      }
    },
    async isBorrowed() {
      try {
        const response = await axios.get('http://localhost:5000/api/isborrowed', {
          headers: { 'x-access-token': `${this.user.token}` },
          params: {
            book_id: this.id
          }
        })
        this.isBookBorrowed = response.data.isBorrowed
      } catch (error) {
        console.error('Error fetching borrow api', error)
      }
    },
    async requestBook(book_id) {
      try {
        const response = await axios.get('http://localhost:5000/api/requestbook', {
          headers: { 'x-access-token': this.user.token },
          params: { 'book_id': book_id }
        })
        if(response.status === 200){
          this.$toast.default(response.data.message, {
            duration: 2000
          })
        }
      } catch(error) {
        console.error("Error requesting book", error)
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getBook()
    this.isBorrowed()
  }
}
</script>
