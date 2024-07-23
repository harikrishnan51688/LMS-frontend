<template>
  <div class="container mt-5">
    <h1 class="mb-4">{{ book.title }}</h1>

    <div class="row">
      <div class="col-md-3">
        <img :src="`http://127.0.0.1:5000/static/${book.image}`" alt="Book Cover" class="img-fluid" />
      </div>
      <div class="col-md-6">
        <h4 class="mb-3">Details</h4>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>
        <p><strong>Published Date:</strong> {{ book.created_at }}</p>
        <p><strong>Description:</strong> {{ book.subtitle }}</p>
        <p><strong>Price:</strong> ₹{{ book.price }}</p>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Buy</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form @submit.prevent="payment">
                <div class="modal-body">
                  <h5>Purpose of payment</h5>
                  <p>
                    <small>Purchase of book {{ book.title }}</small>
                  </p>
                  <h6>Amount</h6>
                  <p>
                    <small>{{ book.price }}</small>
                  </p>

                  <label for="cardnumber">
                    <h6>Card Number</h6>
                  </label>
                  <input type="text" id="cardnumber" class="form-control" placeholder="Card Number" required />
                  <br />
                  <div class="row">
                    <div class="col">
                      <label for="expiry">
                        <h6>Expiry</h6>
                      </label>
                      <input type="text" id="expiry" class="form-control" placeholder="Expiry" required />
                    </div>
                    <div class="col">
                      <label for="cvv">
                        <h6>CVV</h6>
                      </label>
                      <input type="text" id="cvv" class="form-control" placeholder="CVV" required />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <a :href="`http://127.0.0.1:5000/static/${book.file}`"><button type="submit" class="btn btn-success">
                      Pay ₹{{ Math.round(book.price) }}
                    </button></a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <a v-if="is_purchased"
          :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.file}`"
          type="application/pdf" target="_blank">
          <button class="btn btn-secondary me-1">Read</button>
        </a>
        <button v-if="isLoggedIn & !is_purchased & !isSuperUser" type="button" class="btn btn-primary me-1" data-bs-toggle="modal"
          data-bs-target="#exampleModal">
          Buy
        </button>
        <a v-if="isBookBorrowed & !isSuperUser"
          :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.file}`"
          type="application/pdf" target="_blank">
          <button class="btn btn-secondary me-1">Read</button>
        </a>
        <a v-if="!isSuperUser & !isBookBorrowed & !is_purchased">
          <button @click="requestBook(book.id)" class="btn btn-primary me-1">Request book</button>
        </a>
        <a v-if="isSuperUser"
          :href="`https://mozilla.github.io/pdf.js/web/viewer.html?file=http://127.0.0.1:5000/static/${book.file}`"
          type="application/pdf" target="_blank">
          <button class="btn btn-secondary me-1">View</button>
        </a>

      </div>
    </div>
    <br />

    <div class="rating-component">
      <form @submit.prevent="submitRating(book.id)">
        <div class="stars">
          <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }" @click="setRating(star)">
            ★
          </span>
        </div>
        <textarea v-model="comment" placeholder="Leave a comment" required minlength="3"></textarea>
        <div class="output">
          <!-- <p>Rating: {{ rating }}</p> -->
          <!-- <p>Comment: {{ comment }}</p> -->
          <button type="submit" class="btn btn-primary" :disabled="rating === 0">Submit</button>
        </div>
      </form>

      <div class="ratings-list" v-if="ratings.length > 0">
        <h3>Ratings</h3>
        <p>Average: {{ book.avg_rating }}</p>
        <div v-for="(item, index) in ratings" :key="index" class="rating-item">
          <small>{{ item.user_name }} - {{ item.created_at }}
            <a @click="deleteComment(item.id)" href="##">
              <span v-if="isSuperUser" class="material-symbols-outlined">delete</span></a></small>

          <div class="stars small-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= item.rating }">
              ★
            </span>
          </div>
          <p>{{ item.comment }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div class="col-md-4 d-flex align-items-center">
        <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
          <svg class="bi" width="30" height="24">
            <use xlink:href="#bootstrap"></use>
          </svg>
        </a>
        <span class="mb-3 mb-md-0 text-body-secondary">© 2024 Library @iitm</span>
      </div>
      <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li class="ms-3">
          <a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24">
              <use xlink:href="#twitter"></use>
            </svg></a>
        </li>
        <li class="ms-3">
          <a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24">
              <use xlink:href="#instagram"></use>
            </svg></a>
        </li>
        <li class="ms-3">
          <a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24">
              <use xlink:href="#facebook"></use>
            </svg></a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'

export default {
  name: 'BookPage',
  setup() {
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => authStore.isLoggedIn)
    const isSuperUser = computed(() => authStore.isSuperUser)
    const $toast = useToast()
    const rating = ref(0)
    const comment = ref('')

    const setRating = (value) => {
      rating.value = value
    }

    return { isLoggedIn, isSuperUser, $toast, rating, comment, setRating }
  },
  data() {
    return {
      id: null,
      book: [],
      user: JSON.parse(localStorage.getItem('user')) || null,
      isBookBorrowed: false,
      ratings: [],
      is_purchased: false
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

    async getBook() {
      try {
        let loader = this.showLoader()
        const response = await axios.get(`http://localhost:5000/api/book/${this.id}`)
        this.book = response.data.book
        loader.hide()
      } catch (error) {
        console.log('Error fetching book', error)
      }
    },
    async isBorrowed() {
      try {
        const response = await axios.get('http://localhost:5000/api/profile/isborrowed', {
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
      if (!this.isLoggedIn) {
        this.$router.push('/login')
      }
      try {
        const response = await axios.get('http://localhost:5000/api/profile/requestbook', {
          headers: { 'x-access-token': this.user.token },
          params: { book_id: book_id }
        })
        if (response.status === 200) {
          this.$toast.default(response.data.message, {
            duration: 2000,
            type: response.data.status
          })
        }
      } catch (error) {
        console.error('Error requesting book', error)
      }
    },
    async submitRating(book_id) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
      } else {
        try {
          let loader = this.showLoader()
          const formdata = new FormData()
          formdata.append('book_id', book_id)
          formdata.append('rating', this.rating)
          formdata.append('comment', this.comment)
          const response = await axios.post(
            'http://localhost:5000/api/book/submit-rating',
            formdata,
            {
              headers: { 'x-access-token': this.user.token }
            }
          )
          loader.hide()
          if (response.status === 200) {
            this.comment = ''
            this.rating = 0
            await this.getRatings()
          }
        } catch (error) {
          console.error('Error rating book', error)
        }
      }
    },
    async getRatings() {
      try {
        const response = await axios.get('http://localhost:5000/api/book/ratings', {
          headers: { 'x-access-token': this.user.token },
          params: { book_id: this.id }
        })
        this.ratings = response.data.ratings
      } catch (error) {
        console.error('Error fetching ratings', error)
      }
    },
    async deleteComment(comment_id) {
      try {
        const response = await axios.delete('http://localhost:5000/api/book/delete-rating', {
          headers: { 'x-access-token': this.user.token },
          params: { comment_id: comment_id }
        })
        if (response.status === 200) {
          await this.getRatings()
        }
        console.log(response.data)
      } catch (error) {
        console.error('Error deleting rating', error)
      }
    },
    async payment() { 
      try {
        const response = await axios.post('http://localhost:5000/api/book/payment', 
        {
          book_id: this.book.id,
          amount: this.book.price,
        },
        {
          headers: { 'x-access-token': this.user.token },
        })
        if (response.status === 200) {
          this.$toast.default(response.data.message, {
            duration: 2000,
            type: response.data.status
          })
          await this.IsPurchased()
          await this.getBook()
        }
      } catch (error) {
        console.error('Error deleting rating', error)
      }
    },
    async IsPurchased() {
      try {
        const response = await axios.get('http://localhost:5000/api/book/is_purchased', 
        {
          headers: { 'x-access-token': this.user.token },
          params: { 'book_id': this.id }
        },
        )
        if (response.status === 200){
          this.is_purchased = response.data.is_purchased
        }
    } catch (error) {
      console.error("Error making request [is_purchased]", error)
    }
  }
  },
  created() {
    this.id = this.$route.params.id
    this.getBook()
    this.isBorrowed()
    this.getRatings()
    this.IsPurchased()
  }
}
</script>

<style scoped>
.rating-component {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.stars {
  display: flex;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: #d3d3d3;
}

.small-stars .star {
  font-size: 1rem;
}

.star.filled {
  color: gold;
}

textarea {
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.output {
  margin-top: 1rem;
}

.ratings-list {
  margin-top: 2rem;
  width: 100%;
  max-width: 400px;
}

.rating-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.rating-item .stars {
  margin-bottom: 0.5rem;
}

.rating-item small {
  display: block;
  color: #666;
}
</style>
