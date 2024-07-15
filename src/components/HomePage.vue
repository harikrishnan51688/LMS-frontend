<template>
  <!-- Page Content -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <h1 class="mt-4">Welcome to Your Book Website</h1>
        <p class="lead">
          Discover a world of amazing books that will captivate your mind and soul.
        </p>
      </div>
      <div class="col-lg-4">
        <div class="card my-4">
          <h5 class="card-header">Search Books</h5>
          <div class="card-body">
            <form @submit.prevent="searchBooks">
              <div class="input-group">
                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control"
                  id="validationDefaultUsername"
                  placeholder="Search for..."
                  required
                />
                <span class="input-group-btn">
                  <button class="btn btn-secondary" type="submit">Go!</button>
                </span>
              </div>
              <div class="text-end mt-2">
                <router-link to="/search" class="small">Advanced search</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <h2 class="mt-4">{{ heading }}</h2>
        <hr class="short-hr" />
      </div>
      <!-- Book Cards Section -->
      <div v-for="book in books" :key="book.id" class="col-lg-3 col-md-6 mb-4">
        <div>
          <router-link :to="{ name: 'book', params: { id: book.id } }">
            <img
              class="card-img-top img-fluid"
              style="width: 200px; height: 300px"
              :src="`http://127.0.0.1:5000/static/${book.image}`"
              alt="Book Image"
            />
            <div class="card-body">
              <h4 class="card-title">{{ book.title }}</h4>
              <p class="card-text">{{ truncateText(book.subtitle, 28) }}...</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import truncate from 'truncate-utf8-bytes';

export default {
  name: 'HomePage',
  data() {
    return {
      books: [],
      allBooks: [],
      searchQuery: '',
      isSearching: false
    }
  },
  computed: {
    heading() {
      return this.isSearching ? 'Search Results' : 'Featured Books';
    }
  },
  methods: {
    showLoader() {
      let loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: true,
        onCancel: this.onCancel,
        width: 30,
        height: 35,
        color: 'blue'
      })
      return loader
    },

    async getBooks() {
      try {
        let loader = this.showLoader()
        const response = await axios.get('http://localhost:5000/api/book/all')
        this.books = response.data.books
        this.allBooks = response.data.books
        loader.hide()
      } catch (error) {
        console.error("Error fetching books:", error)
      }
    },
    async searchBooks() {
      if (!this.searchQuery) {
        this.books = this.allBooks;
        this.isSearching = false
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/search', {
          params: {
            query: this.searchQuery,
          }
        })
        this.books = response.data.book
        this.isSearching = true
      } catch (error) {
        console.log("Error fetching search query:", error)
      }
    },

    truncateText(text, size){
      return truncate(text, size)
    }
  },
  created() {
    this.getBooks()
  }
}
</script>
