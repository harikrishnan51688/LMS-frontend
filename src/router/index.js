import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/ebooks',
      name: 'ebooks',
      component: () => import('../views/EbookView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/RegisterPage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/components/SearchPage.vue')
    },
    {
      path: '/book/:id',
      name: 'book',
      props: true,
      component: () => import('@/components/SingleBookPage.vue')
    },
    {
      path: '/profile/:user_id?',
      name: 'profile',
      component: () => import('@/components/ProfilePage.vue'),
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/DashboardPage.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/components/UsersPage.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/components/AllBooks.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('@/components/BookRequests.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/add-book',
      name: 'addbook',
      component: () => import('@/components/AddBook.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/sections',
      name: 'sections',
      component: () => import('@/components/SectionsPage.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/add-section',
      name: 'addsection',
      component: () => import('@/components/AddSection.vue'),
      meta: {
        isSuperUser: true
      }
    },
    {
      path: '/manage-section/:section_id',
      name: 'managesection',
      component: () => import('@/components/ManageSection.vue'),
      meta: {
        isSuperUser: true
      }
    },
  ]
})

// for superuser routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isSuperUser = computed(() => authStore.isSuperUser)

  if (to.matched.some((record) => record.meta.isSuperUser)) {
    if (isSuperUser.value) {
      next()
    }
    else {
      // alert('Auth required!')
      next('/login')
    }
  } else{
    next()
  }
})

// for general user routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)

  if (to.matched.some((record) => record.meta.isLoggedIn)) {
    if (isLoggedIn.value) {
      next()
    }
    else {
      // alert('Auth required!')
      next('/login')
    }
  } else{
    next()
  }
})

export default router
