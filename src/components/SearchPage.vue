<template>
  <div class="container">
    <div class="col-lg-15">
      <div class="card my-4">
        <label for="validationCustomUsername" class="form-label">
          <h5 class="card-header">Search Books</h5>
        </label>

        <div class="card-body">
          <form @submit.prevent="searchBooks">
            <div class="input-group">
              <input
                type="text"
                v-model="searchQuery"
                class="form-control"
                id="validationDefaultUsername"
                placeholder="Search for..."
              />
            </div>
            <div class="text mt-2">
              Author:
              <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" v-model="selectedAuthor">
                <option value="">none</option>
                <option v-for="author in authors" :key="author" :value="author">
                  {{ author }}
                </option>
              </select>
              <br />
              Genre:
              <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" v-model="selectedGenre">
                <option value="">none</option>
                <option v-for="genre in genres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </select>
              <br />
              Section:
              <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" v-model="selectedSection">
                <option value="">none</option>
                <option v-for="section in sections" :key="section" :value="section">
                  {{ section }}
                </option>
              </select>
            </div>
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="submit">Go!</button>
            </span>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- {% for book in books %} -->
      <div v-for="book in books" :key="book.id" class="col-lg-3 col-md-6 mb-4">
        <div>
          <router-link :to="{ name: 'book', params: { id: book.id } }">
            <img class="card-img-top img-fluid"  style="width: 200px; height: 300px;" :src="`http://127.0.0.1:5000/static/${book.image}`" alt="Book Image 1">
            <div class="card-body">
              <h4 class="card-title">{{ book.title }}</h4>
              <p class="card-text">{{ book.subtitle }}</p>
            </div>
          </router-link>
          <div class="card-footer">
            <a href="{{ url_for('request_book', book_id=book.id)}}" class="btn btn-secondary"
              >Request</a
            >
          </div>
        </div>
      </div>
      <!-- {% endfor %} -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SearchPage',
  data() {
    return {
      books: [],
      authors: [],
      genres: [],
      sections: [],
      searchQuery: '',
      selectedAuthor: '',
      selectedGenre: '',
      selectedSection: ''
    }
  },
  methods: {
    async getTags() {
      try {
        const response = await axios.get('http://localhost:5000/api/searchtags')
        this.authors = response.data.authors
        this.genres = response.data.genres
        this.sections = response.data.sections
      } catch (error) {
        console.error('Error fetching search tags', error)
      }
    },
    async searchBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/search', {
          params: {
            query: this.searchQuery,
            author: this.selectedAuthor || 'none',
            genre: this.selectedGenre || 'none',
            section: this.selectedSection || 'none'
          }
        })
        this.books = response.data.book
      } catch (error) {
        console.log('Error fetching search query:', error)
      }
    }
  },
  created() {
    this.getTags()
  }
}
</script>
