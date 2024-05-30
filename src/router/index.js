import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      path: '/profile',
      name: 'profile',
      component: () => import('@/components/ProfilePage.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/DashboardPage.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/components/UsersPage.vue')
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/components/AllBooks.vue')
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('@/components/BookRequests.vue')
    },
    {
      path: '/add-book',
      name: 'addbook',
      component: () => import('@/components/AddBook.vue')
    },
    {
      path: '/sections',
      name: 'sections',
      component: () => import('@/components/SectionsPage.vue')
    },
    {
      path: '/add-section',
      name: 'addsection',
      component: () => import('@/components/AddSection.vue')
    },
  ]
})

export default router
