<script setup>
// import WelcomeItem from './WelcomeItem.vue'
// import DocumentationIcon from './icons/IconDocumentation.vue'
// import ToolingIcon from './icons/IconTooling.vue'
// import EcosystemIcon from './icons/IconEcosystem.vue'
// import CommunityIcon from './icons/IconCommunity.vue'
// import SupportIcon from './icons/IconSupport.vue'
</script>

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
            <form method="POST" action="">
              <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />
              <div class="input-group">
                <input
                  type="text"
                  name="text"
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
                <a href="{{ url_for('search') }}" class="small">Advanced search</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <h2 class="mt-4">Featured Books</h2>
        <hr class="short-hr" />
      </div>
      <!-- Book Cards Section -->
      <div v-for="book in books.ebooks" :key="book.id" class="col-lg-3 col-md-6 mb-4">
        <div>
          <a href="#">
            <img
              class="card-img-top img-fluid"
              style="width: 200px; height: 300px"
              :src="`http://127.0.0.1:5000/static/${book.image}`"
              alt="Book Image 1"
            />
            <div class="card-body">
              <h4 class="card-title">{{ book.title }}</h4>
              <p class="card-text">{{ book.subtitle }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      books: []
    }
  },
  methods: {
    getBooks() {
      const path = 'http://localhost:5000/api/books'
      axios
        .get(path)
        .then((res) => {
          this.books = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created() {
    this.getBooks()
  }
}
</script>
