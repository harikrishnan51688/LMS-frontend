<script setup>
import EbookSection from './EbookSection.vue'
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <h2 class="mt-4">
          “There is more treasure in books than in all the pirate's loot on treasure Island.”
        </h2>
        <p class="lead">--Walt Disney</p>
      </div>
      <div class="col-lg-4">
        <div class="card my-4">
          <h5 class="card-header">Search Books</h5>
          <div class="card-body">
            <form method="POST" action="{{ url_for('home') }}">
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

    <!-- Featured Books Section -->
    <div class="row">
      <div class="col-lg-12">
        <h2 class="mt-4">Recently Added</h2>
        <hr class="short-hr" />
      </div>
      <!-- Book Cards Section -->
      <div v-for="book in recently_added" :key="book.id" class="col-lg-3 col-md-6 mb-4">
        <div>
          <a href="{{ url_for('book', book_id=book.id)}}">
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
      <!-- {% endfor %} {% for section in sections %} {% if section.ebook %} -->
      <div v-for="section in sections" :key="section.id" class="row">
        <div class="col-lg-12">
          <h2 class="mt-4">{{ section.section_name }}</h2>
          <hr class="short-hr" />
        </div>
        <!-- Book Cards Section -->
        <EbookSection :section_id="section.section_id" />
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
      recently_added: [],
      sections: []
    }
  },
  methods: {
    getRecentlyAddedBooks() {
      const path = 'http://localhost:5000/api/books'
      axios
        .get(path)
        .then((res) => {
          this.recently_added = this.sortAndLimitBooks(res.data.ebooks)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    sortAndLimitBooks(books) {
      return books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)
    },
    getSections() {
      const path = 'http://localhost:5000/api/sections'
      axios
        .get(path)
        .then((res) => {
          this.sections = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created() {
    this.getRecentlyAddedBooks()
    this.getSections()
  }
}
</script>
